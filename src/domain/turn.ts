import type { Field, Climate } from 'src/domain/field';
import type { Charactor } from 'src/domain/charactor';
import type { Skill } from 'src/domain/skill';

export type DoSkill = {
  type: 'DO_SKILL';
  actor: Charactor;
  skill: Skill;
  receivers: Charactor[];
};

export type DoNothing = {
  type: 'DO_NOTHING';
  actor: Charactor;
};

export type Surrender = {
  type: 'SURRENDER';
  actor: Charactor;
};

export type TimePassing = {
  type: 'TIME_PASSING';
  wt: number;
};

export type Action = TimePassing | DoNothing | DoSkill | Surrender;

export type Turn = {
  datetime: Date;
  action: Action;
  sortedCharactors: Charactor[];
  field: Field;
};
