export type Ability = {
  name: string;
  label: string;
  wait: Wait;
  description: string;
};

export type Wait = (wt: number, charactor: Charactor, randoms: Randoms) => Charactor;
export const justWait: Wait = (wt, charactor, randoms) => charactor; // eslint-disable-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unused-vars
