import test from 'node:test';
import assert from 'node:assert/strict';
import { HOST_PRODUCT_IDS } from '../lib/event-product-ids.ts';

test('defines exactly the six approved host-product routes', () => {
  assert.deepEqual(HOST_PRODUCT_IDS, [
    'hackathon',
    'workshop',
    'panel',
    'keynote',
    'private-dinner',
    'watch-party',
  ]);
});
