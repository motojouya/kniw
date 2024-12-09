import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { raceNames } from '@motojouya/kniw/src/store/acquirement';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  raceNames.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
