import type { Dialogue } from "../io/standard_dialogue";
import { abilityRepository } from "@motojouya/kniw-core/store/ability";

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async (name) => {
    const ability = abilityRepository.get(name);
    if (!ability) {
      await notice(`${name}というabilityは存在しません`);
      return;
    }
    await notice(`アビリティ名: ${ability.label}`);
    await notice(`説明: ${ability.description}`);
  };
