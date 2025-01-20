import type { Field } from "@motojouya/kniw/src/domain/field";
import type { CharactorBattling } from "@motojouya/kniw/src/domain/charactor";
import type { Skill } from "@motojouya/kniw/src/domain/skill";

export const ACTION_DO_NOTHING = "DO_NOTHING";

export type DoSkill = {
  type: "DO_SKILL";
  actor: CharactorBattling;
  skill: Skill;
  receivers: CharactorBattling[];
};

export type DoNothing = {
  type: "DO_NOTHING";
  actor: CharactorBattling;
};

export type Surrender = {
  type: "SURRENDER";
  actor: CharactorBattling;
};

export type TimePassing = {
  type: "TIME_PASSING";
  wt: number;
};

export type Action = TimePassing | DoNothing | DoSkill | Surrender;

export type Turn = {
  datetime: Date;
  action: Action;
  sortedCharactors: CharactorBattling[];
  field: Field;
};
