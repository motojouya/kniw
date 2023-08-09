import assert from 'assert';
import type { Charactor } from 'src/domain/charactor';

import { toCharactor } from 'src/domain/charactor';
import { mpGainPlus } from 'src/data/ability/mpGainPlus';

describe('mpGainPlus#wait', function () {
  it('calc', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as Charactor);
    assert.equal(charactor.mp, 0);

    const result = mpGainPlus.wait(30, charactor, randoms);
    assert.equal(result.mp, 31);
  });
  it('zero', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as Charactor);
    assert.equal(charactor.mp, 0);

    const result = mpGainPlus.wait(0, charactor, randoms);
    assert.equal(result.mp, 0);
  });
  it('over', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as Charactor);
    assert.equal(charactor.mp, 0);

    const result = mpGainPlus.wait(120, charactor, randoms);
    assert.equal(result.mp, 100);
  });
});

