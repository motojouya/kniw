import type { Skill } from 'src/domain/skill'
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy } from 'src/domain/skill'

export const volcanoRise: Skill = {
  name: 'volcanoRise',
  label: 'Volcano Rise',
  action: calcOrdinaryMagicalDamage,
  receiverCount: 5,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '噴火',
};

