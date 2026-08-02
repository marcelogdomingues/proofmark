import { createVerifiableCredentialJwt, verifyCredential, type Issuer } from 'did-jwt-vc';
import { Resolver } from 'did-resolver';
import { getResolver as keyResolver } from 'key-did-resolver';
import type { Identity } from './did.js';
import { hashContent, matchesHash } from './hash.js';

const resolver = new Resolver(keyResolver());

/** A single provenance claim about a piece of content. */
export interface Assertion {
  /** What happened to the content. */
  action: 'created' | 'edited' | 'aiGenerated' | 'reviewed' | 'published';
  /** The tool/model responsible, e.g. "claude-fable-5" or "Photoshop 26". */
  tool?: string;
  /** ISO timestamp; defaults to now at signing time. */
  createdAt?: string;
  /** Free-form extra metadata. */
  meta?: Record<string, unknown>;
}

/** A detached provenance manifest — a C2PA-style sidecar backed by VCs. */
export interface ProvenanceManifest {
  /** `"sha256:..."` binding the manifest to exact content bytes. */
  contentHash: string;
  /** Signed assertion credentials (VC JWTs), in order. */
  assertions: string[];
}

/**
 * Signs one assertion about content as a Verifiable Credential, cryptographically
 * bound to the content hash. Returns the VC JWT.
 */
export async function signAssertion(
  signer: Identity,
  contentHash: string,
  assertion: Assertion,
): Promise<string> {
  const issuer: Issuer = { did: signer.did, signer: signer.signer, alg: 'EdDSA' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: `urn:content:${contentHash}`,
    nbf: now,
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'ContentProvenance'],
      credentialSubject: {
        id: `urn:content:${contentHash}`,
        contentHash,
        action: assertion.action,
        ...(assertion.tool ? { tool: assertion.tool } : {}),
        createdAt: assertion.createdAt ?? new Date().toISOString(),
        ...(assertion.meta ? { meta: assertion.meta } : {}),
      },
    },
  };
  return createVerifiableCredentialJwt(payload, issuer);
}

/**
 * Convenience: hash `content` and produce a manifest with a single assertion.
 */
export async function stamp(
  signer: Identity,
  content: Uint8Array | string,
  assertion: Assertion,
): Promise<ProvenanceManifest> {
  const contentHash = hashContent(content);
  const jwt = await signAssertion(signer, contentHash, assertion);
  return { contentHash, assertions: [jwt] };
}

/**
 * Adds another signed assertion (e.g. an edit or review) to an existing manifest,
 * re-binding to the current content bytes.
 */
export async function addAssertion(
  manifest: ProvenanceManifest,
  signer: Identity,
  content: Uint8Array | string,
  assertion: Assertion,
): Promise<ProvenanceManifest> {
  const contentHash = hashContent(content);
  const jwt = await signAssertion(signer, contentHash, assertion);
  return { contentHash, assertions: [...manifest.assertions, jwt] };
}

export interface VerifiedAssertion {
  issuer: string;
  action: string;
  tool?: string;
  createdAt?: string;
  valid: boolean;
  boundToContent: boolean;
}

export interface VerifiedManifest {
  /** True only if the content matches and every assertion is valid + bound. */
  valid: boolean;
  /** True if the given content matches the manifest's contentHash. */
  contentMatches: boolean;
  assertions: VerifiedAssertion[];
}

/**
 * Verifies a manifest against the actual content bytes: recomputes the hash,
 * checks every assertion's signature, and confirms each is bound to this content.
 */
export async function verifyManifest(
  content: Uint8Array | string,
  manifest: ProvenanceManifest,
): Promise<VerifiedManifest> {
  const contentMatches = matchesHash(content, manifest.contentHash);

  const assertions: VerifiedAssertion[] = [];
  for (const jwt of manifest.assertions) {
    try {
      const v = await verifyCredential(jwt, resolver);
      const subj = v.verifiableCredential.credentialSubject as Record<string, unknown>;
      const boundToContent = subj.contentHash === manifest.contentHash;
      assertions.push({
        issuer: v.issuer,
        action: String(subj.action),
        tool: subj.tool as string | undefined,
        createdAt: subj.createdAt as string | undefined,
        valid: true,
        boundToContent,
      });
    } catch {
      assertions.push({
        issuer: '',
        action: 'unknown',
        valid: false,
        boundToContent: false,
      });
    }
  }

  const valid =
    contentMatches &&
    assertions.length > 0 &&
    assertions.every((a) => a.valid && a.boundToContent);

  return { valid, contentMatches, assertions };
}
