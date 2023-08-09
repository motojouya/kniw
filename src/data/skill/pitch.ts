import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy } from 'src/domain/skill';

export const pitch: Skill = {
  name: 'pitch',
  label: '投げる',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '投げる',
};