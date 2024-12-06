import { describe, it } from "node:test";
import assert from "node:assert";

import { changeClimate } from 'src/domain/field';

describe('Climate#changeClimate', function () {
  it('5 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.05,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('15 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.15,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('25 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.25,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('35 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.35,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('45 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.45,
    });
    assert.strictEqual(result, 'RAIN');
  });
  it('55 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.55,
    });
    assert.strictEqual(result, 'RAIN');
  });
  it('65 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.65,
    });
    assert.strictEqual(result, 'RAIN');
  });
  it('75 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.75,
    });
    assert.strictEqual(result, 'FOGGY');
  });
  it('85 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.85,
    });
    assert.strictEqual(result, 'STORM');
  });
  it('95 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.95,
    });
    assert.strictEqual(result, 'SNOW');
  });

  it('0 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('40 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.40,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('41 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.41,
    });
    assert.strictEqual(result, 'RAIN');
  });
  it('100 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 1,
    });
    assert.strictEqual(result, 'SNOW');
  });

  it('times test', function () {
    const result = changeClimate({
      times: 0.95,
      damage: 0.1,
      accuracy: 0.05,
    });
    assert.strictEqual(result, 'SUNNY');
  });
  it('damage test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.95,
      accuracy: 0.05,
    });
    assert.strictEqual(result, 'SUNNY');
  });

  it('minus test', function () {
    try {
      const result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: -0.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      assert.strictEqual(error.message, 'accuracyの値は0から1です');
    }
  });
  it('over test', function () {
    try {
      const result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: 1.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      assert.strictEqual(error.message, 'accuracyの値は0から1です');
    }
  });
});

