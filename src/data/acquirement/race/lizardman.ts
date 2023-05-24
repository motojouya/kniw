import type { Race, Wearable } from 'src/domain/acquirement'

export const lizardman: Race = {
  name: 'lizardman',
  label: 'リザードマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 0,
    VIT: 10,
    DEX: 10,
    AGI: -10,
    AVD: -10,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  wearable: charactor => true,
  description: 'リザードマン。物理防御力が高い。',
};

