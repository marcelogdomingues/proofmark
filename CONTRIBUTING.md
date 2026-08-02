# Contributing to proofmark

Thanks for helping! proofmark aims to be a small, dependency-light provenance layer.

## Setup

```bash
npm install
npm test
npm run demo
```

## Guidelines

- Add a test for every behaviour change (`test/*.test.ts`, `node:test`).
- Keep the API tiny: hash, sign assertion, build/verify manifest.
- Be explicit about trust and binding in docs — provenance claims prove *who signed*,
  not that a claim is true.
- No heavy dependencies; stays offline.

## Good first contributions

- Adapters to import/export a subset of [C2PA](https://c2pa.org) assertions.
- Helpers for common asset types (files, streams).
- Examples pairing proofmark with agent-passport for AI pipelines.
