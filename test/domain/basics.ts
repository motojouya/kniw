import assert from 'assert';
import {
  changeClimate,
  addPhysicals,
} from 'src/domain/basics';

describe('Climate#changeClimate', function () {
  it('5 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.05,
    });
    assert.equal(result, 'SUNNY');
  });
  it('15 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.15,
    });
    assert.equal(result, 'SUNNY');
  });
  it('25 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.25,
    });
    assert.equal(result, 'SUNNY');
  });
  it('35 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.35,
    });
    assert.equal(result, 'SUNNY');
  });
  it('45 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.45,
    });
    assert.equal(result, 'SUNNY');
  });
  it('55 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.55,
    });
    assert.equal(result, 'RAIN');
  });
  it('65 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.65,
    });
    assert.equal(result, 'RAIN');
  });
  it('75 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.75,
    });
    assert.equal(result, 'FOGGY');
  });
  it('85 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.85,
    });
    assert.equal(result, 'STORM');
  });
  it('95 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.95,
    });
    assert.equal(result, 'SNOW');
  });

  it('0 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0,
    });
    assert.equal(result, 'SUNNY');
  });
  it('40 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.40,
    });
    assert.equal(result, 'SNOW');
  });
  it('41 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.41,
    });
    assert.equal(result, 'SNOW');
  });
  it('100 test', function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 1,
    });
    assert.equal(result, 'SNOW');
  });

  //TODO 数値以外の値の入力も
  //マイナスとか、1を超えるとか、timesとdamageの値の変化とか

});

