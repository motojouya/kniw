import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { clothingNames } from '@motojouya/kniw/src/store/acquirement';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  clothingNames.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
