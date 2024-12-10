import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { weaponNames } from '@motojouya/kniw/src/store/acquirement';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  weaponNames.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
