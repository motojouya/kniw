import type { Dialogue } from "../../io/standard_dialogue";
import { abilityRepository } from "@motojouya/kniw-core/store/ability";

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async (dialogue) =>
  abilityRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
