import type { Race, Wearable } from 'src/domain/acquirement'

export const golem: Race = {
  name: 'golem',
  label: 'ゴーレム',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 10,
    AGI: -10,
    AVD: -10,
    INT: 0,
    MND: 10,
    RES: 0,
    WT: 0,
  },
  wearable: charactor => true,
  description: 'ゴーレム。とにかく堅い。',
};

