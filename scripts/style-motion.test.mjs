import assert from 'node:assert/strict';
import { test } from 'node:test';
import { snapTarget, easedSplit } from '../src/utils/style-motion.ts';

test('the larger visual area wins, with minimal at the midpoint', () => {
  for (const split of [0, 30, 50]) assert.equal(snapTarget(split), 0);
  for (const split of [50.1, 70, 100]) assert.equal(snapTarget(split), 100);
});

test('settling starts at the release position and slows to either edge without overshoot', () => {
  for (const start of [30, 70]) {
    const target = snapTarget(start);
    const positions = Array.from({length: 11}, (_, i) => easedSplit(start, target, i / 10));
    assert.equal(positions[0], start);
    assert.equal(positions.at(-1), target);
    const distances = positions.slice(1).map((value, i) => Math.abs(value - positions[i]));
    distances.slice(1).forEach((distance, i) => assert.ok(distance < distances[i]));
    positions.forEach(value => assert.ok(value >= Math.min(start, target) && value <= Math.max(start, target)));
  }
  assert.equal(easedSplit(70, 100, -1), 70);
  assert.equal(easedSplit(70, 100, 2), 100);
});
