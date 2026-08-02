import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';
import { EdDSASigner, type Signer } from 'did-jwt';

/** An Ed25519 `did:key` identity for an agent or its operator. */
export interface Identity {
  /** The `did:key:z6Mk...` identifier. */
  did: string;
  /** did-jwt signer bound to this key. */
  signer: Signer;
  /** 32-byte Ed25519 private seed. Keep secret. */
  privateKey: Uint8Array;
  /** 32-byte Ed25519 public key. */
  publicKey: Uint8Array;
}

const ED25519_MULTICODEC = new Uint8Array([0xed, 0x01]);

/**
 * Generates (or rehydrates) an Ed25519 `did:key` identity.
 * Pass a 32-byte `seed` for a deterministic DID; omit for a random one.
 */
export function createIdentity(seed?: Uint8Array): Identity {
  const privateKey = seed ?? ed25519.utils.randomPrivateKey();
  if (privateKey.length !== 32) {
    throw new Error('Ed25519 seed must be exactly 32 bytes');
  }
  const publicKey = ed25519.getPublicKey(privateKey);
  const did = 'did:key:z' + bs58.encode(new Uint8Array([...ED25519_MULTICODEC, ...publicKey]));
  const signer = EdDSASigner(new Uint8Array([...privateKey, ...publicKey]));
  return { did, signer, privateKey, publicKey };
}
