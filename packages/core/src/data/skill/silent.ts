import type { Skill } from "@motojouya/kniw/src/domain/skill";
import { addStatus, calcOrdinaryAccuracy, DIRECT_TYPE_NONE, MAGIC_TYPE_ICE } from "@motojouya/kniw/src/domain/skill";
import { silent as silentStatus } from "@motojouya/kniw/src/data/status/silent";

export const silent: Skill = {
  name: "silent",
  label: "音食う雪",
  type: "SKILL_TO_CHARACTOR",
  action: (skill, actor, randoms, field, receiver) => addStatus(silentStatus)(skill, actor, randoms, field, receiver),
  directType: DIRECT_TYPE_NONE,
  magicType: MAGIC_TYPE_ICE,
  baseDamage: 0,
  mpConsumption: 15,
  receiverCount: 1,
  additionalWt: 100,
  effectLength: 5,
  getAccuracy: calcOrdinaryAccuracy,
  description: "沈黙の付与",
};
