export type Physical = {
  MaxHP: number,
  MaxMP: number,
  STR: number,
  VIT: number,
  DEX: number,
  AGI: number,
  AVD: number,
  INT: number,
  MND: number,
  RES: number,
  WT: number,
};

const zeroPhysical: Physical = {
  MaxHP: 0,
  MaxMP: 0,
  STR: 0,
  VIT: 0,
  DEX: 0,
  AGI: 0,
  AVD: 0,
  INT: 0,
  MND: 0,
  RES: 0,
  WT: 0,
};

type AddPhysical = (left: Physical, right: Physical) => Physical
const addPhysical: AddPhysical = (left, right) => ({
  MaxHP: left.MaxHP + right.MaxHP,
  MaxMP: left.MaxMP + right.MaxMP,
  STR  : left.STR   + right.STR,
  VIT  : left.VIT   + right.VIT,
  DEX  : left.DEX   + right.DEX,
  AGI  : left.AGI   + right.AGI,
  AVD  : left.AVD   + right.AVD,
  INT  : left.INT   + right.INT,
  MND  : left.MND   + right.MND,
  RES  : left.RES   + right.RES,
  WT   : left.WT    + right.WT,
})

export type AddPhysicals = (physicals: Physical[]) => Physical
export const addPhysicals: AddPhysicals = physicals => physicals.reduce((acc, item) => addPhysical(acc, item), zeroPhysical);
