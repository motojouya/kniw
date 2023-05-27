import assert from 'assert';
import {
  calcOrdinaryDirectDamage,
  calcOrdinaryMagicalDamage,
  calcOrdinaryAccuracy,
} from 'src/domain/skill';

// export const getAbilities: GetAbilities = charactor => [...charactor.weapon.abilities, ...charactor.armor.abilities, ...charactor.element.abilities];
// export const getSkills: GetSkills = charactor => [...charactor.weapon.skills, ...charactor.armor.skills, ...charactor.element.skills];
// export const getPhysical: GetPhysical = charactor => addPhysicals([basePhysical, charactor.weapon.additionalPhysical, charactor.armor.additionalPhysical, charactor.element.additionalPhysical]);
// export const createCharactor: CreateCharactor = (name, weaponName, armorName, elementName) => {
// export const createStorage: CreateStore<Charactor> = storage => {

describe('Charctor#createCharactor', function () {
  it('create', function () {
    createCharactor();
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

