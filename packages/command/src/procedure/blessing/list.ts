import type { Dialogue } from "../../io/standard_dialogue";
import { blessingRepository } from "@motojouya/kniw-core/store/acquirement";

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async (dialogue) =>
  blessingRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
