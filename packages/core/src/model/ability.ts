import type { CharactorBattling } from "./charactor";
import type { Randoms } from "./random";

export type Ability = {
  name: string;
  label: string;
  wait: Wait;
  description: string;
};

export type Wait = (wt: number, charactor: CharactorBattling, randoms: Randoms) => CharactorBattling;
export const justWait: Wait = (wt, charactor, randoms) => charactor; // eslint-disable-line @typescript-eslint/no-unused-vars
