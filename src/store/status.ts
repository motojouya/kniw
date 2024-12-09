import type { Status } from '@motojouya/kniw/src/domain/status';
import * as statuses from '@motojouya/kniw/src/data/status';

type StatusDictionary = { [name: string]: Status };

export type GetStatus = (name: string) => Status | null;
export const getStatus: GetStatus = name => (statuses as StatusDictionary)[name];
