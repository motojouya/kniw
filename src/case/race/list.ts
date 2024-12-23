import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { raceRepository } from '@motojouya/kniw/src/store/acquirement';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  raceRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
