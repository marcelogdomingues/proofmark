# Começar

## Requisitos

- Node.js 20 ou superior

## Instalação

```bash
npm install proofmark
```

## Carimbar e verificar texto

```ts
import { createIdentity, stamp, verifyManifest } from 'proofmark';

const signer = createIdentity();
const manifest = await stamp(signer, 'o meu conteúdo', { action: 'created' });

const resultado = await verifyManifest('o meu conteúdo', manifest);
// resultado.valid === true
```

## Carimbar um ficheiro (imagem, PDF, o que for)

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { createIdentity, stamp, verifyManifest } from 'proofmark';

const bytes = await readFile('foto.jpg');
const signer = createIdentity();

const manifest = await stamp(signer, bytes, { action: 'created', tool: 'Câmara X' });
// guarda o manifesto ao lado do ficheiro, ex.: foto.jpg.proofmark.json
await writeFile('foto.jpg.proofmark.json', JSON.stringify(manifest));

// mais tarde, em qualquer lado:
const check = await verifyManifest(await readFile('foto.jpg'), manifest);
```

## Construir uma cadeia de proveniência

```ts
let m = await stamp(ferramentaAI, conteudo, { action: 'aiGenerated', tool: 'claude-fable-5' });
m = await addAssertion(m, editor, conteudo, { action: 'edited', tool: 'Editor Pro' });
m = await addAssertion(m, publicador, conteudo, { action: 'published' });
```

Cada afirmação é verificável de forma independente e ligada ao hash do conteúdo.

## Correr a partir do código

```bash
git clone https://github.com/marcelogdomingues/proofmark
cd proofmark
npm install
npm run demo
npm test
```
