import type { Blessing, Wearable } from 'src/domain/acquirement'

const wearableRaces = [
  'human',
  'fairy',
  'werewolf',
  'hawkman',
];

export const sky: Blessing = {
  name: 'sky',
  label: '空',
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
  description: '空の祝福',
};

