import type { Race, Wearable } from 'src/domain/acquirement'

export const hawkman: Race = {
  name: 'hawkman',
  label: 'ホークマン',
  skills: [],
  abilities: [],
  additionalPhysical: {
    MaxHP: 0,
    MaxMP: 0,
    STR: 10,
    VIT: 0,
    DEX: -10,
    AGI: 10,
    AVD: 10,
    INT: 0,
    MND: 0,
    RES: 0,
    WT: 0,
  },
  wearable: charactor => true,
  description: 'ホークマン。飛行移動ができる。',
};

