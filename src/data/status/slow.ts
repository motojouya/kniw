import { Status } from 'src/domain/status';

export const slow: Status = {
  name: 'slow',
  label: 'スロウ',
  wt: 500,
  description: 'WTの消費が2/3になる',
};
