import assert from 'assert';
import {
  Randoms,
  RandomRangeError,
  isRandomRangeError,
  validateRandoms,
  createRandoms,
  createAbsolute,
} from 'src/domain/random';

describe('Randoms', function () {
  it('createRandoms', function () {
    const randoms = createRandoms();
    const result = validateRandoms(randoms);
    const isError = isRandomRangeError(result);

    assert.equal(isError, false);
  });
  it('createAbsolute', function () {
    const randoms = createAbsolute();
    const result = validateRandoms(randoms);
    const isError = isRandomRangeError(result);

    assert.equal(isError, false);
    assert.equal(randoms.times, 1);
    assert.equal(randoms.damage, 1);
    assert.equal(randoms.accuracy, 1);
  });
});

