# Architecture

proofmark binds signed assertions to content by hash. Signing produces a detached manifest;
verification recomputes the hash and checks every assertion's signature and binding.

```mermaid
flowchart TB
  subgraph Stamp
    C1["content bytes"] --> H1["hashContent → sha256:…"]
    H1 --> A["signAssertion (VC)<br/>action · tool · createdAt"]
    A --> M["Manifest<br/>{ contentHash, assertions[] }"]
  end
  subgraph Verify
    C2["content bytes"] --> H2["recompute hash"]
    M --> VC["verify each assertion (VC)"]
    H2 --> CHK{"hash matches AND<br/>all sigs valid AND bound?"}
    VC --> CHK
    CHK --> R["{ valid, contentMatches, assertions[] }"]
  end
```

## Module map

| Module | Responsibility |
| --- | --- |
| `hash.ts` | Content-binding hash (`sha256:…`) and comparison |
| `did.ts` | Ed25519 `did:key` signer identities |
| `manifest.ts` | Sign assertions, build/extend manifests, verify |

## Design principles

- **Content-bound** — every assertion embeds the hash; change a byte and verification fails.
- **Detached sidecar** — the manifest is portable JSON; store it anywhere (unlike embedded C2PA).
- **Proves signer, not truth** — trust depends on which signer DIDs you accept.
- **Any bytes** — text, images, PDFs; the API takes `Uint8Array`.
