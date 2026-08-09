import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlannerOpening, runHostRequestFlow, validateHostRequest } from '../lib/host-planning.ts';

test('rejects a host request with no selected format', () => {
  assert.equal(validateHostRequest([], 'host@example.com'), 'picks');
});

test('rejects a host request with an invalid email', () => {
  assert.equal(validateHostRequest(['hackathon'], 'not-an-email'), 'email');
});

test('accepts a selected format and trims a valid email', () => {
  assert.equal(validateHostRequest(['hackathon'], '  host@example.com  '), null);
});

test('builds planner context from formats without accepting or exposing email', () => {
  const opening = buildPlannerOpening(['Hackathon', 'Workshop'], 'en');

  assert.equal(
    opening,
    "Your request for Hackathon + Workshop is saved. Let's turn it into a concrete plan. What outcome matters most?",
  );
  assert.equal(opening.includes('@'), false);
});

test('saves the lead before opening the planner and excludes email from planner context', async () => {
  const calls: string[] = [];
  let plannerContext: unknown;

  await runHostRequestFlow(
    { email: 'host@example.com', picks: ['hackathon'] },
    ['Hackathon'],
    async (lead) => {
      calls.push(`save:${lead.email}`);
    },
    (context) => {
      calls.push('open');
      plannerContext = context;
    },
  );

  assert.deepEqual(calls, ['save:host@example.com', 'open']);
  assert.deepEqual(plannerContext, { formatLabels: ['Hackathon'] });
  assert.equal(JSON.stringify(plannerContext).includes('host@example.com'), false);
});

test('does not open the planner when lead capture fails', async () => {
  let opened = false;

  await assert.rejects(() =>
    runHostRequestFlow(
      { email: 'host@example.com', picks: ['hackathon'] },
      ['Hackathon'],
      async () => {
        throw new Error('network');
      },
      () => {
        opened = true;
      },
    ),
  );

  assert.equal(opened, false);
});
