import assert from 'assert';
import type { CharactorBattling } from 'src/domain/charactor';

import { toCharactor } from 'src/store/schema/charactor';
import { mpGainPlus } from 'src/data/ability/mpGainPlus';

describe('mpGainPlus#wait', function () {
  it('calc', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as CharactorBattling);
    assert.equal(charactor.mp, 0);

    const result = mpGainPlus.wait(30, charactor, randoms);
    assert.equal(result.mp, 2);
  });
  it('zero', function () {
    const randoms = {
      times: 0.1,
      damage: 0.1,
      accuracy: 0.1,
    };
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as CharactorBattling);
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
    const charactor = (toCharactor({ name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 }) as CharactorBattling);
    assert.equal(charactor.mp, 0);

    const result = mpGainPlus.wait(210, charactor, randoms);
    assert.equal(result.mp, 11);
  });
});

