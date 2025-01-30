import type { Dialogue } from "../../io/standard_dialogue";
import { skillRepository } from "@motojouya/kniw-core/store/skill";

export type List = (dialogue: Dialogue) => Promise<void>;
export const list: List = async (dialogue) =>
  skillRepository.list.reduce((p, name) => p.then(() => dialogue.notice(`- ${name}`)), Promise.resolve());
