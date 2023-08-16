import type { Ability, Wait } from 'src/domain/ability';
import { getPhysical } from 'src/domain/charactor';

/* eslint-disable */
const wait: Wait = (wt, charactor, randoms) => {
  const turnAdd = Math.floor(wt / 20);
  let randomAdd = Math.ceil(randoms.damage * 5);
  if (turnAdd < randomAdd) {
    randomAdd = 0;
  }
  let mp = charactor.mp + turnAdd + randomAdd;

  const physical = getPhysical(charactor);
  if (mp > physical.MaxMP) {
    mp = physical.MaxMP;
  }

  return {
    ...charactor,
    mp,
  };
};
/* eslint-enable */

export const mpGainPlus: Ability = {
  name: 'mpGainPlus',
  label: 'MP回復強化',
  wait,
  description: 'MPの回復速度が早くなる',
};
