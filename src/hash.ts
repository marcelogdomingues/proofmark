import { createHash } from 'node:crypto';

/**
 * Content-binding hash. Returns `"sha256:<hex>"` so the algorithm travels with
 * the digest (multihash-style, but human readable).
 */
export function hashContent(data: Uint8Array | string): string {
  const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : Buffer.from(data);
  return 'sha256:' + createHash('sha256').update(buf).digest('hex');
}

/** True if `data` hashes to `expected` (constant work; not timing-sensitive). */
export function matchesHash(data: Uint8Array | string, expected: string): boolean {
  return hashContent(data) === expected;
}
