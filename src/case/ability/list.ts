import type { Dialogue } from '@motojouya/kniw/src/io/standard_dialogue';
import { abilityRepository } from '@motojouya/kniw/src/store/ability';

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async dialogue =>
  abilityRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
