import type { Ability, Wait } from 'src/domain/ability'

const wait: Wait = (wt, charactor, randoms) => {
  let mp = charactor.mp + (wt * 5) + Math.ceil(randoms.damage * 5);
  if (mp > charactor.MaxMp) {
    mp = charactor.MaxMp;
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

