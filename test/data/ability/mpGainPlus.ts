import assert from 'assert';
import type { NotWearableErorr } from 'src/domain/acquirement';

import { Charactor, createCharactor } from 'src/domain/charactor'
import { mpGainPlus } from 'src/data/ability/mpGainPlus';

describe('mpGainPlus#wait', function () {
  it('calc', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charctor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    assert.equal(charctor.mp, 0);

    const result = mpGainPlus.wait(30, charctor, randoms);
    assert.equal(result.mp, 31);
  });
  it('zero', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charctor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    assert.equal(charctor.mp, 0);

    const result = mpGainPlus.wait(0, charctor, randoms);
    assert.equal(result.mp, 0);
  });
  it('over', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charctor = (createCharactor('sam', 'human', 'earth', 'fireRobe', 'fireWand') as Charactor);
    assert.equal(charctor.mp, 0);

    const result = mpGainPlus.wait(120, charctor, randoms);
    assert.equal(result.mp, 100);
  });
});

