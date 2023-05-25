import type { Clothing, Wearable } from 'src/domain/acquirement'

const wearableBlessings = [
  'mind',
  'earth',
];

export const fireRobe: Clothing = {
  name: 'fireRobe',
  label: '炎の衣',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 10,
    MND: 20,
    RES: 0,
    WT: 0,
  },
  wearable: charactor => wearableBlessings.includes(charactor.blessing.name),
  description: '炎の衣。魔法耐久が高い',
};

