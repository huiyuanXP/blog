import assert from 'node:assert/strict';
import { test } from 'node:test';
import { angleDelta, advanceRotation, releaseSpeed, ORNAMENT_SPEED } from '../src/utils/ornament-motion.ts';

test('dragging follows the shortest signed angle across the seam', () => {
  assert.equal(angleDelta(179, -179), 2);
  assert.equal(angleDelta(-179, 179), -2);
  assert.equal(angleDelta(40, 100), 60);
  assert.equal(angleDelta(100, 40), -60);
  assert.equal(angleDelta(720, 10), 10);
});

test('clockwise and counterclockwise inertia converge smoothly to the normal speed', () => {
  for (const initialSpeed of [240, -240, 0]) {
    let state = {angle: 0, speed: initialSpeed};
    for (let frame = 0; frame < 600; frame++) {
      const next = advanceRotation(state.angle, state.speed, 1 / 60);
      assert.ok(Math.abs(next.speed - ORNAMENT_SPEED) <= Math.abs(state.speed - ORNAMENT_SPEED));
      if (initialSpeed >= ORNAMENT_SPEED) assert.ok(next.speed >= ORNAMENT_SPEED);
      else assert.ok(next.speed <= ORNAMENT_SPEED);
      state = next;
    }
    assert.ok(Math.abs(state.speed - ORNAMENT_SPEED) < 0.03);
  }
  assert.ok(advanceRotation(0, -240, 0.1).angle < 0);
  assert.ok(advanceRotation(0, 240, 0.1).angle > 0);
});

test('rotation integrates identically at different frame rates', () => {
  for (const initialSpeed of [-360, 0, 360]) {
    const expected = advanceRotation(75, initialSpeed, 3);
    for (const fps of [30, 60, 120]) {
      let state = {angle: 75, speed: initialSpeed};
      for (let frame = 0; frame < fps * 3; frame++) state = advanceRotation(state.angle, state.speed, 1 / fps);
      assert.ok(Math.abs(state.angle - expected.angle) < 1e-9);
      assert.ok(Math.abs(state.speed - expected.speed) < 1e-9);
    }
  }
  assert.equal(advanceRotation(15, ORNAMENT_SPEED, 60).angle, 195);
});

test('holding before release dissipates the throw in either direction', () => {
  for (const initialSpeed of [-360, 360]) {
    assert.equal(releaseSpeed(initialSpeed, 0.02), initialSpeed);
    assert.ok(Math.abs(releaseSpeed(initialSpeed, 0.4)) < 0.13);
  }
});
