# proofmark

**Content provenance you can actually verify.** Sign *what created or edited* a piece
of content — an AI model, a tool, a human — as W3C Verifiable Credentials that are
cryptographically **bound to the exact bytes**. A C2PA-style provenance sidecar,
offline and dependency-light.

🌍 **[English](README.md)** · [Português](README.pt.md) · 📚 [Documentation](docs/README.md)

[![CI](https://github.com/marcelogdomingues/proofmark/actions/workflows/ci.yml/badge.svg)](https://github.com/marcelogdomingues/proofmark/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/proofmark.svg)](https://www.npmjs.com/package/proofmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Why

"Was this AI-generated?" is the wrong question — you can't reliably detect it after
the fact. The right question is **"who claims to have made this, and can I verify
it?"** proofmark answers that: each actor *signs* an assertion (created / edited /
`aiGenerated` / reviewed) bound to the content hash. Change one byte and the
verification fails. It mirrors the [C2PA](https://c2pa.org) model of signed
assertions, using portable Verifiable Credentials instead of embedded manifests.

## Install

```bash
npm install proofmark
```

## Quick start

```ts
import { createIdentity, stamp, addAssertion, verifyManifest } from 'proofmark';

const aiTool = createIdentity();
const reviewer = createIdentity();
const content = 'An article drafted by AI, then reviewed by a human.';

// The AI tool stamps what it generated…
let manifest = await stamp(aiTool, content, { action: 'aiGenerated', tool: 'claude-fable-5' });
// …a human reviewer signs off on the same bytes.
manifest = await addAssertion(manifest, reviewer, content, { action: 'reviewed', tool: 'human' });

const result = await verifyManifest(content, manifest);
console.log(result.valid);          // true
console.log(result.contentMatches); // true — flips to false if a byte changes
```

Run the demo: `npm run demo`.

## API

| Function | Purpose |
| --- | --- |
| `createIdentity(seed?)` | Ed25519 `did:key` identity for a signer (AI tool or person). |
| `hashContent(data)` | Content-binding hash (`"sha256:…"`). |
| `stamp(signer, content, assertion)` | Hash content + produce a manifest with one signed assertion. |
| `addAssertion(manifest, signer, content, assertion)` | Append another signed assertion. |
| `signAssertion(signer, hash, assertion)` | Low-level: sign one assertion VC. |
| `verifyManifest(content, manifest)` | Recompute hash, verify every signature + binding. |

An **assertion** has `action` (`created` \| `edited` \| `aiGenerated` \| `reviewed`
\| `published`), an optional `tool`, `createdAt`, and free-form `meta`.

## What it is (and isn't)

- ✅ Portable, offline, verifiable provenance for any bytes (text, images, files).
- ✅ Multi-actor chains (generator → editor → reviewer → publisher).
- ⚠️ It does **not** embed a manifest inside a JPEG/PNG like full C2PA — it's a
  **detached sidecar** bound by hash. See [docs/en/vs-c2pa.md](docs/en/vs-c2pa.md).
- ⚠️ It proves *who signed a claim*, not that the claim is true. Trust is rooted in
  which signer DIDs you accept.

## License

MIT © Marcelo Domingues
