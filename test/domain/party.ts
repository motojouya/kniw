import { describe, it } from "node:test";
import assert from "node:assert";

import type { Party } from 'src/domain/party';
import { CharactorDuplicationError } from 'src/domain/party';
import { toParty } from 'src/store/schema/party';
import { toCharactor } from 'src/store/schema/charactor';

describe('Party#toParty', function () {
  it('CharactorDuplicationError', function () {
    const party = (toParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);
    assert.strictEqual(party instanceof CharactorDuplicationError, true);
    if (party instanceof CharactorDuplicationError) {
      assert.strictEqual(party.message, 'Partyに同じ名前のキャラクターが存在します');
    } else {
      assert.strictEqual(true, false);
    }
  });
  it('ok', function () {
    const party = (toParty({ name: 'team01', charactors: [
      { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
      { name: 'john', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
    ]}) as Party);

    assert.strictEqual(party.name, 'team01');
    assert.strictEqual(party.charactors.length, 2);
    assert.strictEqual(party.charactors[0].name, 'sam');
    assert.strictEqual(party.charactors[1].name, 'john');
  });
});

