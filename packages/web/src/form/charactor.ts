import type { Charactor } from "@motojouya/kniw-core/model/charactor";

import { z } from "zod";

import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";
import { getPhysical, validate, createCharactor } from "@motojouya/kniw-core/model/charactor";
import {
  raceRepository,
  weaponRepository,
  clothingRepository,
  blessingRepository,
} from "@motojouya/kniw-core/store/acquirement";

export const charactorFormSchema = z.object({
  name: z.string().min(1),
  race: z.string().min(1),
  blessing: z.string().min(1),
  clothing: z.string().min(1),
  weapon: z.string().min(1),
});
export type CharactorForm = z.infer<typeof charactorFormSchema>;

export type ToCharactorForm = (charactor: Charactor) => CharactorForm;
export const toCharactorForm: ToCharactorForm = (charactor) => ({
  name: charactor.name,
  race: charactor.race.name,
  blessing: charactor.blessing.name,
  clothing: charactor.clothing.name,
  weapon: charactor.weapon.name,
});

export type ToCharactor = (charactorForm: CharactorForm) => Charactor | NotWearableErorr | DataNotFoundError;
export const toCharactor: ToCharactor = (charactorForm) => {
  const { name } = charactorForm;

  const race = raceRepository.get(charactorForm.race);
  if (!race) {
    return new DataNotFoundError(charactorForm.race, "race", `${charactorForm.race}という種族は存在しません`);
  }

  const blessing = blessingRepository.get(charactorForm.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      charactorForm.blessing,
      "blessing",
      `${charactorForm.blessing}という祝福は存在しません`,
    );
  }

  const clothing = clothingRepository.get(charactorForm.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      charactorForm.clothing,
      "clothing",
      `${charactorForm.clothing}という装備は存在しません`,
    );
  }

  const weapon = weaponRepository.get(charactorForm.weapon);
  if (!weapon) {
    return new DataNotFoundError(charactorForm.weapon, "weapon", `${charactorForm.weapon}という武器は存在しません`);
  }

  // TODO 以降のコードはmodel/charactor#createCharactorを使うべき
  // 違うね。そもそもCharactorとCharactorBattlingは別物なので、それを分けて置くべき
  // んでformからはCharactorにだけ変換できる。storeは両方のパターンがあるので、両方の関数を作る。
  // CharactorBattlingはBattleからしか呼ばれない感じ。createCharactorはBattle#start時に適用するので、それまではCharactorの状態にしておく。
  // charactorFormも必要ならcharacorBattingFormを用意したらいいわけで、こっちはCharacor専用
  const validateResult = validate(name, race, blessing, clothing, weapon);
  if (validateResult instanceof NotWearableErorr) {
    return validateResult;
  }

  const someone: Charactor = {
    name,
    race,
    blessing,
    clothing,
    weapon,
    statuses: [],
    hp: 0,
    mp: 0,
    restWt: 0,
  };

  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.restWt = someonesPhysical.WT;

  return someone;
};
