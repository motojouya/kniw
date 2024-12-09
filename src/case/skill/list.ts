import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { skillNames } from '@motojouya/kniw/src/store/skill';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  skillNames.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
