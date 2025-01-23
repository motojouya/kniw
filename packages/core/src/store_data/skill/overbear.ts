import type { Skill } from "@motojouya/kniw/src/domain/skill";
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_NONE } from "@motojouya/kniw/src/domain/skill";
import { avoidDown } from "@motojouya/kniw/src/data/status/avoidDown";

export const overbear: Skill = {
  name: "overbear",
  label: "威圧",
  type: "SKILL_TO_CHARACTOR",
  action: (skill, actor, randoms, field, receiver) => addStatus(avoidDown)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_NONE,
  baseDamage: 0,
  mpConsumption: 10,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: "対象の回避率を下げる",
};
