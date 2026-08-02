# How it works

## Content binding

`hashContent(bytes)` produces `"sha256:<hex>"`. Every assertion embeds this hash, and
`verifyManifest` recomputes it from the bytes you present. If they differ, the content
has changed and verification fails — this is what makes provenance *tamper-evident*.

## Assertions as Verifiable Credentials

Each assertion is a W3C VC signed by the actor's `did:key`:

```jsonc
{
  "type": ["VerifiableCredential", "ContentProvenance"],
  "issuer": "did:key:<signer>",
  "credentialSubject": {
    "id": "urn:content:sha256:…",
    "contentHash": "sha256:…",
    "action": "aiGenerated",
    "tool": "claude-fable-5",
    "createdAt": "2026-08-02T10:00:00.000Z"
  }
}
```

Signatures are EdDSA (Ed25519); verification uses `key-did-resolver` — fully offline.

## The manifest

A `ProvenanceManifest` is just `{ contentHash, assertions: string[] }` where each
string is a signed VC JWT. It's a **detached sidecar**: store it alongside the asset
(e.g. `photo.jpg.proofmark.json`), in a database, or in a header.

## Verification result

`verifyManifest` returns:

- `contentMatches` — do the bytes match the manifest hash?
- `assertions[]` — for each: `issuer`, `action`, `tool`, `valid` (signature ok),
  `boundToContent` (its `contentHash` matches the manifest).
- `valid` — true only if the content matches **and** every assertion is valid and
  bound.

## Trust model

proofmark proves *who signed what*. Whether to believe an assertion depends on
whether you trust that signer DID. In practice you keep an allow-list of known tool
and organization DIDs, or publish them via `did:web`.
