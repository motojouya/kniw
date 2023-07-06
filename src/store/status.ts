import type { Status } from 'src/domain/status';
import * as statuses from 'src/data/status';

type StatusDictionary = { [name: string]: Status };

export type GetStatus = (name: string) => Status | null;
export const getStatus: GetStatus = name => (statuses as StatusDictionary)[name];
