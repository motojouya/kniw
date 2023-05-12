import assert from 'assert';
import {
  changeClimate,
  addPhysicals,
} from '../../src/domain/basics'; //TODO 絶対path

describe('Climate#changeClimate', function () {
  it('0 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0,
    });
    assert.equal(result, 'SUNNY');
  });
  it('10 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    });
    assert.equal(result, 'SUNNY');
  });
  it('50 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.5,
    });
    assert.equal(result, 'RAIN');
  });
});

