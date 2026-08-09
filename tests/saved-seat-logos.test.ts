import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { SAVED_SEATS } from '../lib/saved-seats.ts';

test('every saved seat uses real local mark and localized wordmark assets', async () => {
  assert.equal(SAVED_SEATS.length, 7);

  for (const seat of SAVED_SEATS) {
    assert.match(seat.mark, /^\/logos\/saved-seats\/[a-z0-9-]+-mark\.svg$/);
    assert.match(seat.wordmark.en, /^\/logos\/saved-seats\/[a-z0-9-]+\.svg$/);
    assert.match(seat.wordmark.zh, /^\/logos\/saved-seats\/[a-z0-9-]+\.svg$/);
    assert.equal(seat.logoAlt.en, `${seat.en} logo`);
    assert.equal(seat.logoAlt.zh, `${seat.zh} logo`);

    await Promise.all(
      [seat.mark, seat.wordmark.en, seat.wordmark.zh].map((asset) =>
        access(join(process.cwd(), 'public', asset)),
      ),
    );
  }
});

test('English mode uses the Z.ai wordmark', () => {
  const zhipu = SAVED_SEATS.find(({ id }) => id === 'zhipu');

  assert.equal(zhipu?.wordmark.en, '/logos/saved-seats/zai-en.svg');
  assert.notEqual(zhipu?.wordmark.en, zhipu?.wordmark.zh);
});
