import type { Skill } from 'src/domain/skill';
import { calcOrdinaryDirectDamage, calcOrdinaryAccuracy, DIRECT_TYPE_BLOW, MAGIC_TYPE_NONE } from 'src/domain/skill';

export const lightMeteor: Skill = {
  name: 'lightMeteor',
  label: '軽量隕石',
  type: 'SKILL_TO_CHARACTOR',
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_BLOW,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 100,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '',
};
