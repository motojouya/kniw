import type { Skill } from 'src/domain/skill';
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ROCK } from 'src/domain/skill';
import { directDiffenceDown } from 'src/data/status/directDiffenceDown';

export const stoneWeather: Skill = {
  name: 'stoneWeather',
  label: '風化',
  type: 'SKILL_TO_CHARACTOR',
  action: ((skill, actor, randoms, field, receiver) => addStatus(directDiffenceDown)(skill, actor, randoms, field, receiver)),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ROCK,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: '物理防御down',
};
