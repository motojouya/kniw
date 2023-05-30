import type { Weapon, Wearable } from 'src/domain/acquirement'
import { volcanoRise } from 'src/data/skill/volcanoRise'

const wearableClothings = [
  'fireRobe',
];

export const fireWand: Weapon = {
  name: 'fireWand',
  label: '炎の杖',
  skills: [volcanoRise],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 20,
    VIT: 10,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 10,
  },
  wearable: charactor => wearableClothings.includes(charactor.clothing.name),
  description: '炎の杖。大地属性で炎の魔法が打てる杖。',
};

const wearable: Wearable = (self, { wearableRaces, wearableBlessings, wearableClothings, wearableWeapons }) => charactor => {
  const clothingWearable = wearableClothings.includes(charactor.clothing.name);
  if (!clothingWearable) {
    return {
      acquirement: self,
      cause: charactor.clothing
      message: 'このキャラクターの装備では' + self.name + 'を持つことはできません。',
    };
  }

  return null;
};


