import type { Skill } from "@motojouya/kniw/src/domain/skill";
import {
  calcOrdinaryDirectDamage,
  calcOrdinaryAccuracy,
  DIRECT_TYPE_BLOW,
  MAGIC_TYPE_NONE,
} from "@motojouya/kniw/src/domain/skill";

export const lightMeteor: Skill = {
  name: "lightMeteor",
  label: "軽量隕石",
  type: "SKILL_TO_CHARACTOR",
  action: calcOrdinaryDirectDamage,
  directType: DIRECT_TYPE_BLOW,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 150,
  mpConsumption: 30,
  receiverCount: 1,
  additionalWt: 150,
  effectLength: 1,
  getAccuracy: calcOrdinaryAccuracy,
  description: "",
};
