import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATTENDEE_NETWORK_DISPLAY,
  EVENT_COUNT_DISPLAY,
  HEADLINE_STATS,
  MONTHLY_EVENT_PLAN_DISPLAY,
} from '../lib/site-metrics.ts';

test('exports one canonical value for every headline metric', () => {
  assert.equal(EVENT_COUNT_DISPLAY, '52');
  assert.equal(ATTENDEE_NETWORK_DISPLAY, '150K+');
  assert.equal(MONTHLY_EVENT_PLAN_DISPLAY, '3–5');
});

test('publishes the approved operating metrics in order', () => {
  assert.deepEqual(
    HEADLINE_STATS.map(({ display, en }) => ({ display, en })),
    [
      { display: '52', en: 'Events since Jan 2025' },
      { display: '150K+', en: 'Builders in our attendee network' },
      { display: '3–5', en: 'Events planned monthly' },
    ],
  );
});
