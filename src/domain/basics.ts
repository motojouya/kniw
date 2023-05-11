
export type Randoms = {
  times: number,
  damage: number,
  accuracy: number,
}

export type Climate = 'SUNNY' | 'RAIN' | 'STORM' | 'SNOW' | 'FOGGY';
type ClimateParcent = {
  name: Climate,
  parcent: number,
};

const climateParcent: ClimateParcent[] = [
  { name: 'SUNNY', parcent: 40 },
  { name: 'RAIN', parcent: 30 },
  { name: 'FOGGY', parcent: 10 },
  { name: 'STORM', parcent: 10 },
  { name: 'SNOW', parcent: 10 },
];

export type ChangeClimate = (randoms: Randoms) => Climate;
export const changeClimate: ChangeClimate = randoms => {

  const parcentAccuracy = randoms.accuracy * 100;
  const candidates = climateParcent.reduce((acc, climate) => {
    if (!acc.length === 0) {
      return [climate];
    }

    const lastOne = acc.slice(-1)[0];
    climate.parcent += lastOne.parcent;
    acc.push(climate);

    return acc;
  }, []);

  const climate = candidates.find(candidate => candidate.parcent > parcentAccuracy);
  return climate.name;
}

export type Field = {
  climate: Climate,
}

export type Status = {
  name: string,
  restWt: number,
  description: string,
}


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

type AddPhysical = (left: Physical) => (right: Physical) => Physical
const addPhysical: AddPhysical = left => right => ({
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

