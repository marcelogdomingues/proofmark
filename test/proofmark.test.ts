import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createIdentity,
  hashContent,
  matchesHash,
  stamp,
  addAssertion,
  verifyManifest,
} from '../src/index.js';

test('hashContent is stable and prefixed', () => {
  const h = hashContent('hello');
  assert.match(h, /^sha256:[0-9a-f]{64}$/);
  assert.equal(hashContent('hello'), h);
  assert.notEqual(hashContent('hello'), hashContent('world'));
  assert.ok(matchesHash('hello', h));
});

test('stamp then verify a single assertion', async () => {
  const ai = createIdentity();
  const content = 'AI-generated report';
  const manifest = await stamp(ai, content, { action: 'aiGenerated', tool: 'claude-fable-5' });

  const result = await verifyManifest(content, manifest);
  assert.equal(result.valid, true);
  assert.equal(result.contentMatches, true);
  assert.equal(result.assertions.length, 1);
  assert.equal(result.assertions[0]!.issuer, ai.did);
  assert.equal(result.assertions[0]!.action, 'aiGenerated');
  assert.equal(result.assertions[0]!.tool, 'claude-fable-5');
  assert.equal(result.assertions[0]!.boundToContent, true);
});

test('provenance chain with multiple signers', async () => {
  const ai = createIdentity();
  const reviewer = createIdentity();
  const content = 'draft';

  let manifest = await stamp(ai, content, { action: 'aiGenerated', tool: 'model' });
  manifest = await addAssertion(manifest, reviewer, content, { action: 'reviewed', tool: 'human' });

  const result = await verifyManifest(content, manifest);
  assert.equal(result.valid, true);
  assert.equal(result.assertions.length, 2);
  assert.equal(result.assertions[0]!.issuer, ai.did);
  assert.equal(result.assertions[1]!.issuer, reviewer.did);
});

test('tampered content fails verification', async () => {
  const ai = createIdentity();
  const content = 'original';
  const manifest = await stamp(ai, content, { action: 'created' });

  const result = await verifyManifest('modified', manifest);
  assert.equal(result.valid, false);
  assert.equal(result.contentMatches, false);
});

test('a forged/broken assertion is flagged invalid', async () => {
  const ai = createIdentity();
  const content = 'x';
  const manifest = await stamp(ai, content, { action: 'created' });
  // Corrupt the JWT signature.
  const jwt = manifest.assertions[0]!;
  const parts = jwt.split('.');
  parts[2] = parts[2]!.slice(0, -1) + (parts[2]!.endsWith('A') ? 'B' : 'A');
  const broken = { ...manifest, assertions: [parts.join('.')] };

  const result = await verifyManifest(content, broken);
  assert.equal(result.valid, false);
  assert.equal(result.assertions[0]!.valid, false);
});
