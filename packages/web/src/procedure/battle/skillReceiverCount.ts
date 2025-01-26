import { ACTION_DO_NOTHING } from "@motojouya/kniw-core/model/turn";
import { skillRepository } from "@motojouya/kniw-core/store/skill";

export type SkillReceiverCount = (skillName: string) => number;
export const skillReceiverCount: SkillReceiverCount = (skillName) => {
  if (skillName === ACTION_DO_NOTHING) {
    return 0;
  }

  const skill = skillRepository.get(skillName);
  if (!skill || !skill.receiverCount) {
    return 0;
  }

  return skill.receiverCount;
};
