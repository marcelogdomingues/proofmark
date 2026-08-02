/**
 * Demo: an AI tool stamps generated content, a human reviewer adds an edit
 * assertion, and a verifier confirms the whole provenance chain — offline.
 *
 * Run with: `npm run demo`
 */
import { createIdentity, stamp, addAssertion, verifyManifest, hashContent } from './index.js';

async function main() {
  const aiTool = createIdentity();     // the generator's identity
  const reviewer = createIdentity();   // a human editor/reviewer

  const content = 'An article drafted by an AI model, then reviewed by a human.';

  // 1. The AI tool stamps the content it generated.
  let manifest = await stamp(aiTool, content, { action: 'aiGenerated', tool: 'claude-fable-5' });

  // 2. A reviewer signs off on it (same bytes).
  manifest = await addAssertion(manifest, reviewer, content, { action: 'reviewed', tool: 'human' });

  console.log('Content hash:', hashContent(content));
  console.log('Assertions in manifest:', manifest.assertions.length);

  // 3. A verifier checks the manifest against the actual content.
  const result = await verifyManifest(content, manifest);
  console.log('\nManifest valid:', result.valid);
  console.log('Content matches:', result.contentMatches);
  for (const a of result.assertions) {
    console.log(`- ${a.action} by ${a.issuer.slice(0, 24)}… (bound: ${a.boundToContent})`);
  }

  // 4. Tampered content no longer matches.
  const tampered = await verifyManifest(content + ' [edited]', manifest);
  console.log('\nAfter tampering — valid:', tampered.valid, '| matches:', tampered.contentMatches);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
