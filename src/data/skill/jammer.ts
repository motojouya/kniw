import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_THUNDER } from 'src/domain/skill';
import { magicAttackDown } from 'src/data/status/magicAttackDown';

export const jammer: Skill = {
  name: 'jammer',
  label: '妨害魔法',
  type: 'SKILL_TO_CHARACTOR',
  action: addStatus(magicAttackDown),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_THUNDER,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '魔法攻撃down',
};
