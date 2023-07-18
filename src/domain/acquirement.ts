import { Ability } from 'src/domain/ability';
import { Physical } from 'src/domain/physical';
import { Skill } from 'src/domain/skill';

export type Acquirement = {
  name: string;
  label: string;
  skills: Skill[];
  abilities: Ability[];
  additionalPhysical: Physical;
  validateWearable: ValidateWearable;
  description: string;
};
// TODO 移動範囲、移動高さの概念を追加したい。コード上は関係ないがゲーム時に任意で参照する。
// Acquirementでは、追加補正でこの辺りがあって欲しい

export type ValidateWearable = (
  race: Race | null,
  weapon: Weapon | null,
  clothing: Clothing | null,
  blessing: Blessing | null,
) => null | NotWearableErorr;

export type Race = Acquirement;
export type Weapon = Acquirement;
export type Clothing = Acquirement;
export type Blessing = Acquirement;

export class NotWearableErorr {
  constructor(
    readonly acquirement: Acquirement,
    readonly cause: Acquirement,
    readonly message: string,
  ) {}
}

export type CreateValidateWearable = (
  self: Acquirement,
  wearableAcquirements: {
    wearableRaces: string[];
    wearableBlessings: string[];
    wearableClothings: string[];
    wearableWeapons: string[];
  },
) => ValidateWearable;
export const createValidateWearable: CreateValidateWearable =
  (self, { wearableRaces, wearableBlessings, wearableClothings, wearableWeapons }) =>
  (race, blessing, clothing, weapon) => {
    if (wearableRaces.length > 0 && !!race) {
      const raceWearable = wearableRaces.includes(race.name);
      if (!raceWearable) {
        return new NotWearableErorr(self, race, `このキャラクターの設定では${self.name}を装備できません`);
      }
    }

    if (wearableBlessings.length > 0 && !!blessing) {
      const blessingWearable = wearableBlessings.includes(blessing.name);
      if (!blessingWearable) {
        return new NotWearableErorr(self, blessing, `このキャラクターの設定では${self.name}を装備できません`);
      }
    }

    if (wearableClothings.length > 0 && !!clothing) {
      const clothingWearable = wearableClothings.includes(clothing.name);
      if (!clothingWearable) {
        return new NotWearableErorr(self, clothing, `このキャラクターの設定では${self.name}を装備できません`);
      }
    }

    if (wearableWeapons.length > 0 && !!weapon) {
      const weaponWearable = wearableWeapons.includes(weapon.name);
      if (!weaponWearable) {
        return new NotWearableErorr(self, weapon, `このキャラクターの設定では${self.name}を装備できません`);
      }
    }

    return null;
  };
