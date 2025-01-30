import type { Dialogue } from "../../io/standard_dialogue";
import { clothingRepository } from "@motojouya/kniw-core/store/acquirement";

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async (dialogue) =>
  clothingRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
