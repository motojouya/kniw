import type { Clothing, Wearable } from 'src/domain/acquirement'

const wearableRaces = [
  'human',
  'lizardman',
  'merman',
  'werewolf',
];

export const steelArmor: Clothing = {
  name: 'steelArmor',
  label: '鋼鉄の鎧',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 20,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 10,
    RES: 0,
    WT: 10,
  },
  wearable: charactor => wearableRaces.includes(charactor.race.name),
  description: '鋼鉄の鎧。物理耐久が高い',
};

