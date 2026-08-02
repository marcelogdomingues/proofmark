# Recipes

## Stamp a file and store a sidecar

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { createIdentity, stamp } from 'proofmark';

const signer = createIdentity();
const bytes = await readFile('report.pdf');
const manifest = await stamp(signer, bytes, { action: 'created', tool: 'ReportGen 1.0' });
await writeFile('report.pdf.proofmark.json', JSON.stringify(manifest, null, 2));
```

## Stamp AI output at generation time

```ts
import { createIdentity, stamp } from 'proofmark';

const model = createIdentity(); // persist this seed as your model's identity
async function generateAndStamp(prompt: string) {
  const text = await llm.generate(prompt);
  const manifest = await stamp(model, text, { action: 'aiGenerated', tool: 'claude-fable-5' });
  return { text, manifest };
}
```

## Verify on ingest

```ts
import { readFile } from 'node:fs/promises';
import { verifyManifest } from 'proofmark';

const bytes = await readFile('report.pdf');
const manifest = JSON.parse(await readFile('report.pdf.proofmark.json', 'utf8'));
const result = await verifyManifest(bytes, manifest);
if (!result.valid) throw new Error('Provenance check failed');
```

## Build a provenance chain

```ts
import { stamp, addAssertion } from 'proofmark';

let m = await stamp(aiTool, content, { action: 'aiGenerated', tool: 'model' });
m = await addAssertion(m, editor, content, { action: 'edited', tool: 'Editor Pro' });
m = await addAssertion(m, publisher, content, { action: 'published' });
```

## Only trust known signers

```ts
const trusted = new Set([model.did, reviewer.did]);
const result = await verifyManifest(bytes, manifest);
const allTrusted = result.assertions.every((a) => trusted.has(a.issuer));
```
