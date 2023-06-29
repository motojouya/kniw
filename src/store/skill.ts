import type { Skill } from 'src/domain/skill'
import * as skills from 'src/data/skill'

type SkillDictionary = { [name: string]: Skill };

export type CreateSkill = (name: string) => Skill | null;
export const createSkill: CreateSkill = name => (skills as SkillDictionary)[name];

