import type { Charactor, CharactorBattling } from "./charactor";
import { isBattlingCharactor } from "./charactor";

export type Party = {
  name: string;
  charactors: Charactor[];
};

export type PartyBattling = {
  name: string;
  charactors: CharactorBattling[];
};

export function isBattlingParty(party: Party): party is PartyBattling {
  return party.charactors.every((charactor) => isBattlingCharactor(charactor));
}

export class CharactorDuplicationError {
  constructor(
    readonly name: string,
    readonly message: string,
  ) {}
}

export type Validate = (name: string, charactors: Charactor[]) => CharactorDuplicationError | null;
export const validate: Validate = (name, charactors) => {
  const nameCountMap = charactors.reduce(
    (acc, charactor) => {
      const nameCount = acc[charactor.name];
      if (!nameCount) {
        acc[charactor.name] = 0;
      }
      acc[charactor.name] += 1;

      return acc;
    },
    {} as { [name: string]: number },
  );

  for (const nameKey in nameCountMap) {
    if (nameCountMap[nameKey] > 1) {
      return new CharactorDuplicationError(nameKey, "Partyに同じ名前のキャラクターが存在します");
    }
  }

  return null;
};

export type CreateParty = (name: string, charactors: Charactor[]) => Party | CharactorDuplicationError;
export const createParty: CreateParty = (name, charactors) => {
  const validateResult = validate(name, charactors);
  if (validateResult instanceof CharactorDuplicationError) {
    return validateResult;
  }

  return {
    name,
    charactors,
  };
};
