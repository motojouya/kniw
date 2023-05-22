import type {
  Skill,
  ActionToCharactor,
  GetAccuracy,
  calcOrdinaryMagicalDamage,
  calcOrdinaryAccuracy,
} from 'src/domain/skill'

export const volcateRise: Skill = {
  name: 'volcateRise',
  label: 'Volcate Rise',
  action: calcOrdinaryMagicalDamage,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '噴火',
};

