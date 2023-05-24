import type { Blessing, Wearable } from 'src/domain/acquirement'

const wearableRaces = [
  'human',
  'fairy',
  'lizardman',
  'merman',
];

export const sea: Blessing = {
  name: 'sea',
  label: '海',
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
  wearable: charactor => wearableRaces.includes(charactor.race.name),
  description: '海の祝福',
};

