export type Randoms = {
  times: number,
  damage: number,
  accuracy: number,
}

export class RandomRangeError {
  constructor(
    public prop: string,
    public value: number,
    public message: string,
  ) {}
}

export function isRandomRangeError(obj: any): obj is RandomRangeError {
  return obj instanceof RandomRangeError;
}

export type ValidateRandoms = (randoms: Randoms) => null | RandomRangeError;
export const validateRandoms: ValidateRandoms = ({ times, damage, accuracy }) => {
  if (times > 1 || times < 0) {
    return new RandomRangeError('times', times, 'timesの値は0から1です');
  }
  if (damage > 1 || damage < 0) {
    return new RandomRangeError('damage', damage, 'damageの値は0から1です');
  }
  if (accuracy > 1 || accuracy < 0) {
    return new RandomRangeError('accuracy', accuracy, 'accuracyの値は0から1です');
  }
  return null;
};

export type CreateRandoms = () => Randoms
export const createRandoms: CreateRandoms = () => ({
  times: Math.random(),
  damage: Math.random(),
  accuracy: Math.random(),
});

export type CreateAbsolute = () => Randoms
export const createAbsolute: CreateAbsolute = () => ({
  times: 1,
  damage: 1,
  accuracy: 1,
});

