import assert from 'assert';
import type { Party } from 'src/domain/party';
import {
  createParty,
  isCharactorDuplicationError,
} from 'src/domain/party';
import {
  createCharactor,
  Charactor,
} from 'src/domain/charactor';
import { isNotWearableErorr } from 'src/domain/acquirement';

describe('Party#createParty', function () {
  it('CharactorDuplicationError', function () {
    const party = (createParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);
    assert.equal(isCharactorDuplicationError(party), true);
    if (isCharactorDuplicationError(party)) {
      assert.equal(party.message, 'Partyに同じ名前のキャラクターが存在します');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const party = (createParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'lightSword'},
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'fireRobe', weapon: 'fireWand'},
    ]}) as Party);

    assert.equal(party.name, 'team01');
    assert.equal(party.charactors.length, 2);
    assert.equal(party.charactors[0].name, 'sam');
    assert.equal(party.charactors[1].name, 'john');
  });
});

