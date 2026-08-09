import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { SAVED_SEATS } from '../lib/saved-seats.ts';

test('every saved seat uses a real local logo asset', async () => {
  assert.equal(SAVED_SEATS.length, 8);

  for (const seat of SAVED_SEATS) {
    assert.match(seat.logo, /^\/logos\/saved-seats\/[a-z0-9-]+\.svg$/);
    assert.equal(seat.logoAlt, `${seat.en} logo`);
    await access(join(process.cwd(), 'public', seat.logo));
  }
});
