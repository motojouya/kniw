import type { Race, Wearable } from 'src/domain/acquirement'

export const human: Race = {
  name: 'human',
  label: 'ヒト',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 0,
    DEX: 0,
    AGI: 0,
    AVD: 0,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  wearable: charactor => true,
  description: 'ヒト。特に装備の制約が少なく、できることも多いが逆に言えば器用貧乏',
};

