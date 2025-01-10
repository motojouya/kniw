import type { Skill } from "@motojouya/kniw/src/domain/skill";
import {
  calcOrdinaryDirectDamage,
  calcOrdinaryAccuracy,
  DIRECT_TYPE_BLOW,
  MAGIC_TYPE_NONE,
} from "@motojouya/kniw/src/domain/skill";

export const blow: Skill = {
  name: "blow",
  label: "殴る",
  type: "SKILL_TO_CHARACTOR",
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_BLOW,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 90,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 1,
  getAccuracy: calcOrdinaryAccuracy,
  description: "打撃攻撃",
};
