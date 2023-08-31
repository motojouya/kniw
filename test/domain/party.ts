import assert from 'assert';
import type { Party } from 'src/domain/party';
import type { Charactor } from 'src/domain/charactor';
import { CharactorDuplicationError } from 'src/domain/party';
import { toParty } from 'src/store/schema/party';
import { toCharactor } from 'src/store/schema/charactor';

describe('Party#toParty', function () {
  it('CharactorDuplicationError', function () {
    const party = (toParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);
    assert.equal(party instanceof CharactorDuplicationError, true);
    if (party instanceof CharactorDuplicationError) {
      assert.equal(party.message, 'Partyに同じ名前のキャラクターが存在します');
    } else {
      assert.equal(true, false);
    }
  });
  it('ok', function () {
    const party = (toParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);

    assert.equal(party.name, 'team01');
    assert.equal(party.charactors.length, 2);
    assert.equal(party.charactors[0].name, 'sam');
    assert.equal(party.charactors[1].name, 'john');
  });
});

