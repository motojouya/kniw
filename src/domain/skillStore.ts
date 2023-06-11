import type { Skill } from 'src/domain/skill'

type SkillDictionary = { [name: string]: Skill };

export type CreateSkill = (name: string) => Skill | null;
export const createSkill: CreateSkill = name => (skills as SkillDictionary)[name];

