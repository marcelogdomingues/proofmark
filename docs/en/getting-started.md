# Getting started

## Requirements

- Node.js 20 or newer

## Install

```bash
npm install proofmark
```

## Stamp and verify text

```ts
import { createIdentity, stamp, verifyManifest } from 'proofmark';

const signer = createIdentity();
const manifest = await stamp(signer, 'my content', { action: 'created' });

const result = await verifyManifest('my content', manifest);
// result.valid === true
```

## Stamp a file (image, PDF, anything)

```ts
import { readFile } from 'node:fs/promises';
import { createIdentity, stamp, verifyManifest } from 'proofmark';

const bytes = await readFile('photo.jpg');
const signer = createIdentity();

const manifest = await stamp(signer, bytes, { action: 'created', tool: 'Camera X' });
// persist the manifest next to the file, e.g. photo.jpg.proofmark.json
await writeFile('photo.jpg.proofmark.json', JSON.stringify(manifest));

// later, anywhere:
const check = await verifyManifest(await readFile('photo.jpg'), manifest);
```

## Build a provenance chain

```ts
let m = await stamp(aiTool, content, { action: 'aiGenerated', tool: 'claude-fable-5' });
m = await addAssertion(m, editor, content, { action: 'edited', tool: 'Editor Pro' });
m = await addAssertion(m, publisher, content, { action: 'published' });
```

Each assertion is independently verifiable and bound to the content hash.

## Run from source

```bash
git clone https://github.com/marcelogdomingues/proofmark
cd proofmark
npm install
npm run demo
npm test
```
