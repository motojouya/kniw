import type { Skill } from '@motojouya/kniw/src/domain/skill';
import * as skills from '@motojouya/kniw/src/data/skill/index';

type SkillDictionary = { [name: string]: Skill };

export type GetSkill = (name: string) => Skill | null;
export const getSkill: GetSkill = name => (skills as SkillDictionary)[name];
export const skillNames: string[] = Object.keys(skills as SkillDictionary);
export const allSkills: Skill[] = Object.values(skills as SkillDictionary);
