import assert from 'assert';
import {
  createCharactor,
  isAcquirementNotFoundError,
  createStorage,
  getAbilities,
  getSkills,
  getPhysical,
} from 'src/domain/charactor';

// export const getAbilities: GetAbilities = charactor => [...charactor.weapon.abilities, ...charactor.armor.abilities, ...charactor.element.abilities];
// export const getSkills: GetSkills = charactor => [...charactor.weapon.skills, ...charactor.armor.skills, ...charactor.element.skills];
// export const getPhysical: GetPhysical = charactor => addPhysicals([basePhysical, charactor.weapon.additionalPhysical, charactor.armor.additionalPhysical, charactor.element.additionalPhysical]);
// export const createCharactor: CreateCharactor = (name, weaponName, armorName, elementName) => {
// export const createStorage: CreateStore<Charactor> = storage => {

describe('Charctor#createCharactor', function () {
  it('create', function () {
    const charactor = createCharactor('sam', 'race01', 'blessing01', 'clothing01', 'weapon01');
    assert.equal(isAcquirementNotFoundError(charactor), true);
    if (isAcquirementNotFoundError(charactor)) {
      assert.equal(charactor.acquirementName, 'race01');
      assert.equal(charactor.type, 'race');
      assert.equal(charactor.message, 'race01という種族は存在しません');
    }
  });
});

