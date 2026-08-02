# Receitas

## Carimbar um ficheiro e guardar um sidecar

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { createIdentity, stamp } from 'proofmark';

const signer = createIdentity();
const bytes = await readFile('relatorio.pdf');
const manifest = await stamp(signer, bytes, { action: 'created', tool: 'ReportGen 1.0' });
await writeFile('relatorio.pdf.proofmark.json', JSON.stringify(manifest, null, 2));
```

## Carimbar output de IA no momento da geração

```ts
import { createIdentity, stamp } from 'proofmark';

const model = createIdentity(); // persiste esta seed como a identidade do teu modelo
async function gerarECarimbar(prompt: string) {
  const text = await llm.generate(prompt);
  const manifest = await stamp(model, text, { action: 'aiGenerated', tool: 'claude-fable-5' });
  return { text, manifest };
}
```

## Verificar na ingestão

```ts
import { readFile } from 'node:fs/promises';
import { verifyManifest } from 'proofmark';

const bytes = await readFile('relatorio.pdf');
const manifest = JSON.parse(await readFile('relatorio.pdf.proofmark.json', 'utf8'));
const result = await verifyManifest(bytes, manifest);
if (!result.valid) throw new Error('Verificação de proveniência falhou');
```

## Construir uma cadeia de proveniência

```ts
import { stamp, addAssertion } from 'proofmark';

let m = await stamp(ferramentaAI, content, { action: 'aiGenerated', tool: 'model' });
m = await addAssertion(m, editor, content, { action: 'edited', tool: 'Editor Pro' });
m = await addAssertion(m, publicador, content, { action: 'published' });
```

## Confiar apenas em signatários conhecidos

```ts
const confiaveis = new Set([model.did, revisor.did]);
const result = await verifyManifest(bytes, manifest);
const todosConfiaveis = result.assertions.every((a) => confiaveis.has(a.issuer));
```
