import type { Status } from 'src/domain/status'
import * as statuses from 'src/data/status'

type StatusDictionary = { [name: string]: Status };

export type CreateStatus = (name: string) => Status | null;
export const createStatus: CreateStatus = name => (statuses as StatusDictionary)[name];

