import type { Field } from "./field";
import type { CharactorBattling } from "./charactor";
import type { Skill } from "./skill";

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
