# FAQ & troubleshooting

### Can proofmark detect if something was AI-generated?

No — detection after the fact is unreliable. proofmark proves the opposite direction: *who
signed a claim* (created / edited / `aiGenerated` / reviewed) bound to the exact bytes. It's
attestation, not detection.

### Is this real C2PA?

It shares C2PA's model of signed assertions but uses **portable W3C VCs in a detached
sidecar** instead of a manifest embedded in the media. See [proofmark vs full C2PA](vs-c2pa.md).

### `verifyManifest` says `contentMatches: false`

The bytes you passed don't hash to the manifest's `contentHash` — the content changed (even
one byte), or you verified against a different file. That's the tamper-evidence working.

### Where do I store the manifest?

Anywhere: next to the asset (e.g. `photo.jpg.proofmark.json`), in a database, or in a header.
It's just `{ contentHash, assertions }`.

### Does a valid signature mean the claim is true?

No. It proves *who signed it*. Whether to believe the claim depends on whether you trust that
signer's DID — keep an allow-list of known tool/organization DIDs.

### Does it work on images and binaries?

Yes — `stamp`/`verifyManifest` accept `Uint8Array`, so any bytes (images, PDFs, files) work,
not just text.
