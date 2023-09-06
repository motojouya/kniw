import type { CharactorBattling } from 'src/domain/charactor';
import type { Randoms } from 'src/domain/random';

export type Ability = {
  name: string;
  label: string;
  wait: Wait;
  description: string;
};

export type Wait = (wt: number, charactor: CharactorBattling, randoms: Randoms) => CharactorBattling;
export const justWait: Wait = (wt, charactor, randoms) => charactor; // eslint-disable-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unused-vars
