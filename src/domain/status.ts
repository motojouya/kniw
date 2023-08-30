import { getStatus } from 'src/store/status';
import type { Charactor } from 'src/domain/charactor';

export type Status = {
  name: string;
  label: string;
  wt: number;
  description: string;
};

export type UnderStatus = (status: Status, charactor: Charactor) => boolean;
export const underStatus: UnderStatus = (status, charactor) =>
  !!charactor.statuses.find(s => s.status.name === status.name);
