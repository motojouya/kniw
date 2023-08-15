import type { Skill, ActionToField } from 'src/domain/skill';
import { calcOrdinaryMagicalDamage, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_WIND } from 'src/domain/skill';
import {  } from 'src/domain/field';

const changeClimate: ActionToField = (self, actor, randoms, field) => {
  return {
    ...field,
    climate: 'RAIN',
  };
};

export const clearCloud: Skill = {
  name: 'clearCloud',
  label: '晴れ',
  type: 'SKILL_TO_FIELD',
  action: changeClimate,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_WIND,
  mpConsumption: 15,
  receiverCount: 0,
  additionalWt: 100,
  getAccuracy: calcOrdinaryAccuracy,
  description: '天候操作。晴れにする',
};
