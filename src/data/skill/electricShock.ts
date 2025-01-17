import type { Skill } from "@motojouya/kniw/src/domain/skill";
import {
  calcOrdinaryMagicalDamage,
  calcOrdinaryAccuracy,
  DIRECT_TYPE_NONE,
  MAGIC_TYPE_THUNDER,
} from "@motojouya/kniw/src/domain/skill";

export const electricShock: Skill = {
  name: "electricShock",
  label: "広がる雷",
  type: "SKILL_TO_CHARACTOR",
  action: calcOrdinaryMagicalDamage,
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_THUNDER,
  baseDamage: 30,
  mpConsumption: 30,
  receiverCount: 5,
  additionalWt: 150,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: "雷の範囲魔法",
};
