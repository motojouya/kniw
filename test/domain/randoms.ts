import assert from 'assert';
import {
  RandomRangeError,
  validateRandoms,
  createRandoms,
  createAbsolute,
} from 'src/domain/random';

describe('Randoms#validateRandoms', function () {
  it('createRandoms', function () {
    const randoms = createRandoms();
    const result = validateRandoms(randoms);
    const isError = result instanceof RandomRangeError;

    assert.equal(isError, false);
  });
  it('createAbsolute', function () {
    const randoms = createAbsolute();
    const result = validateRandoms(randoms);
    const isError = result instanceof RandomRangeError;

    assert.equal(isError, false);
    assert.equal(randoms.times, 1);
    assert.equal(randoms.damage, 1);
    assert.equal(randoms.accuracy, 1);
  });
  it('zero', function () {
    const result = validateRandoms({
      times: 0,
      damage: 0,
      accuracy: 0,
    });
    const isError = result instanceof RandomRangeError;

    assert.equal(isError, false);
  });

  it('minus times', function () {
    const result = validateRandoms({
      times: -0.1,
      damage: -0.1,
      accuracy: -0.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'times');
      assert.equal(result.value, -0.1);
      assert.equal(result.message, 'timesの値は0から1です');
    } else {
      assert.fail();
    }
  });
  it('minus damage', function () {
    const result = validateRandoms({
      times: 0.1,
      damage: -0.1,
      accuracy: -0.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'damage');
      assert.equal(result.value, -0.1);
      assert.equal(result.message, 'damageの値は0から1です');
    } else {
      assert.fail();
    }
  });
  it('minus accuracy', function () {
    const result = validateRandoms({
      times: 0.1,
      damage: 0.1,
      accuracy: -0.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'accuracy');
      assert.equal(result.value, -0.1);
      assert.equal(result.message, 'accuracyの値は0から1です');
    } else {
      assert.fail();
    }
  });

  it('over times', function () {
    const result = validateRandoms({
      times: 1.1,
      damage: 1.1,
      accuracy: 1.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'times');
      assert.equal(result.value, 1.1);
      assert.equal(result.message, 'timesの値は0から1です');
    } else {
      assert.fail();
    }
  });
  it('over damage', function () {
    const result = validateRandoms({
      times: 0.9,
      damage: 1.1,
      accuracy: 1.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'damage');
      assert.equal(result.value, 1.1);
      assert.equal(result.message, 'damageの値は0から1です');
    } else {
      assert.fail();
    }
  });
  it('over accuracy', function () {
    const result = validateRandoms({
      times: 0.9,
      damage: 0.9,
      accuracy: 1.1,
    });
    if (result instanceof RandomRangeError) {
      assert.ok(result);
      assert.equal(result.prop, 'accuracy');
      assert.equal(result.value, 1.1);
      assert.equal(result.message, 'accuracyの値は0から1です');
    } else {
      assert.fail();
    }
  });
});

