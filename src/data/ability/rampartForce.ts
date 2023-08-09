import type { Ability } from 'src/domain/ability';
import { justWait } from 'src/domain/ability';

export const rampartForce: Ability = {
  name: 'rampartForce',
  label: 'ランパートフォース',
  wait: justWait,
  description: '隣を通る際に一旦停止する',
};
