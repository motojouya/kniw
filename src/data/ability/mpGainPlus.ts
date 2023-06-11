import type { Ability, Wait } from 'src/domain/ability'
import { getPhysical } from 'src/domain/charactor'

const wait: Wait = (wt, charactor, randoms) => {
  const turnAdd = wt;
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

export const mpGainPlus: Ability = {
  name: 'mpGainPlus',
  label: 'MP回復強化',
  wait: wait,
  description: 'MPの回復速度が早くなる',
};

