import type { Notice } from 'src/io/standard_dialogue';
import { skillNames } from 'src/store/skill';

export type List = (notice: Notice) => Promise<void>;
export const list: List = async notice => skillNames.forEach(async name => await notice(`- ${name}`));
