import type { Charactor } from "./charactor";

export type Status = {
  name: string;
  label: string;
  wt: number;
  description: string;
};

export type UnderStatus = (status: Status, charactor: Charactor) => boolean;
export const underStatus: UnderStatus = (status, charactor) =>
  !!charactor.statuses.find((s) => s.status.name === status.name);
