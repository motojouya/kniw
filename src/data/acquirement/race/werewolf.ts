import type { Race } from 'src/domain/acquirement';
import { createValidateWearable } from 'src/domain/acquirement';

export const werewolf: Race = {
  name: 'werewolf',
  label: 'ワーウルフ',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 10,
    VIT: 0,
    DEX: 0,
    AGI: 10,
    AVD: 10,
    INT: -10,
    MND: 0,
    RES: 0,
    WT: -5,
  },
  validateWearable: (race, blessing, clothing, weapon) => {
    const validate = createValidateWearable(werewolf, {
      wearableRaces: [],
      wearableBlessings: [],
      wearableClothings: [],
      wearableWeapons: [],
    });
    return validate(race, blessing, clothing, weapon);
  },
  description: 'ワーウルフ。物理攻撃力が高い。',
};
