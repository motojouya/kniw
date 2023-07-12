import type { Dialogue } from 'src/io/standard_dialogue';
import { getAbility } from 'src/store/ability';

export type Show = (dialogue: Dialogue) => (name: string) => Promise<void>;
export const show: Show =
  ({ notice }) =>
  async name => {
    const ability = getAbility(name);
    if (!ability) {
      await notice(`${name}というabilityは存在しません`);
      return;
    }
    await notice(`アビリティ名: ${ability.label}`);
    await notice(`説明: ${ability.description}`);
  };
