import type { Skill } from 'src/domain/skill'
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy } from 'src/domain/skill'

export const chop: Skill = {
  name: 'chop',
  label: '斬りつける',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '斬りつける',
};

