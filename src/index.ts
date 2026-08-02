export { createIdentity, type Identity } from './did.js';
export { hashContent, matchesHash } from './hash.js';
export {
  signAssertion,
  stamp,
  addAssertion,
  verifyManifest,
  type Assertion,
  type ProvenanceManifest,
  type VerifiedManifest,
  type VerifiedAssertion,
} from './manifest.js';
