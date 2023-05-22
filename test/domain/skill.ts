import assert from 'assert';
import {
  calcOrdinaryDirectDamage,
  calcOrdinaryMagicalDamage,
  calcOrdinaryAccuracy,
} from 'src/domain/skill';

// export const calcOrdinaryDirectDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
// export const calcOrdinaryMagicalDamage: ActionToCharactor = (self, actor, randoms, field, receiver) => {
// export const calcOrdinaryAccuracy: GetAccuracy = (self, actor, field, receiver) => (100 + calcAttackAccuracy(actor) - calcDefenceAccuracy(receiver)) / 100;



const basePhysical: Physical = {
  MaxHP: 100,
  MaxMP: 100,
  STR: 100,
  VIT: 100,
  DEX: 100,
  AGI: 100,
  AVD: 100,
  INT: 100,
  MND: 100,
  RES: 100,
  WT: 100,
};

describe('Physical#addPhysicals', function () {
  it('add', function () {
    const result = addPhysicals([
      basePhysical,
      {
        MaxHP: 10,
        MaxMP: 10,
        STR: 10,
        VIT: 10,
        DEX: 10,
        AGI: 10,
        AVD: 10,
        INT: 10,
        MND: 10,
        RES: 10,
        WT: 10,
      },
      {
        MaxHP: 1,
        MaxMP: 1,
        STR: 1,
        VIT: 1,
        DEX: 1,
        AGI: 1,
        AVD: 1,
        INT: 1,
        MND: 1,
        RES: 1,
        WT: 1,
      },
    ]);

    assert.equal(result.MaxHP, 111);
    assert.equal(result.MaxMP, 111);
    assert.equal(result.STR, 111);
    assert.equal(result.VIT, 111);
    assert.equal(result.DEX, 111);
    assert.equal(result.AGI, 111);
    assert.equal(result.AVD, 111);
    assert.equal(result.INT, 111);
    assert.equal(result.MND, 111);
    assert.equal(result.RES, 111);
    assert.equal(result.WT, 111);
  });

  it('minus', function () {
    const result = addPhysicals([
      basePhysical,
      {
        MaxHP: -10,
        MaxMP: -10,
        STR: -10,
        VIT: -10,
        DEX: -10,
        AGI: -10,
        AVD: -10,
        INT: -10,
        MND: -10,
        RES: -10,
        WT: -10,
      },
      {
        MaxHP: 1,
        MaxMP: 1,
        STR: 1,
        VIT: 1,
        DEX: 1,
        AGI: 1,
        AVD: 1,
        INT: 1,
        MND: 1,
        RES: 1,
        WT: 1,
      },
    ]);

    assert.equal(result.MaxHP, 91);
    assert.equal(result.MaxMP, 91);
    assert.equal(result.STR, 91);
    assert.equal(result.VIT, 91);
    assert.equal(result.DEX, 91);
    assert.equal(result.AGI, 91);
    assert.equal(result.AVD, 91);
    assert.equal(result.INT, 91);
    assert.equal(result.MND, 91);
    assert.equal(result.RES, 91);
    assert.equal(result.WT, 91);
  });
});

