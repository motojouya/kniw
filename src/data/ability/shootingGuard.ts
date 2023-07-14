import type { Ability } from 'src/domain/ability';
import { justWait } from 'src/domain/ability';

export const shootingGuard: Ability = {
  name: 'shootingGuard',
  label: '矢かわし',
  wait: justWait,
  description: '弓矢の攻撃を受けない',
};
