# proofmark vs full C2PA

[C2PA](https://c2pa.org) (Content Credentials) is the industry standard for content
provenance, backed by Adobe, Microsoft, the BBC and others. proofmark shares its core
idea — **signed assertions about content** — but makes different trade-offs.

| | proofmark | Full C2PA |
| --- | --- | --- |
| Assertion signing | W3C VCs (EdDSA JWT) | COSE / X.509 certificates |
| Storage | Detached sidecar (bound by hash) | Embedded manifest (JUMBF) inside the file |
| Trust root | DIDs you accept (`did:key`, `did:web`) | X.509 PKI / trust lists |
| Media handling | Any bytes; no format parsing | Format-aware (JPEG, PNG, MP4, …) |
| Footprint | Tiny, offline, no PKI | Heavier; certificate infrastructure |
| Best for | Pipelines, APIs, text/data, learning | Cameras, editors, publishers at scale |

## When to use proofmark

- You control both ends (your pipeline signs, your service verifies).
- You want provenance for **text, JSON, model outputs**, or files where embedding a
  C2PA manifest isn't practical.
- You already use DIDs/VCs (e.g. alongside
  [agent-passport](https://github.com/marcelogdomingues/agent-passport)).

## When to use C2PA

- You need interoperability with the broad Content Credentials ecosystem and viewers.
- You must embed provenance *inside* media that travels through third-party tools.

## Can they coexist?

Yes. A common pattern: use proofmark internally for fast, offline, DID-based
provenance across your pipeline, and export a C2PA manifest at the boundary where
content is published to the public.
