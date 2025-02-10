import type { Charactor } from "@motojouya/kniw-core/model/charactor";
import type { CharactorForm } from "../../form/charactor";
// import type { PartyForm } from '../../form/party';

import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";
import {
  raceRepository,
  blessingRepository,
  clothingRepository,
  weaponRepository,
} from "@motojouya/kniw-core/store/acquirement";
import { createCharactor } from "@motojouya/kniw-core/model/charactor";
import { EmptyParameter } from "../../io/window_dialogue";

export type HireCharactor = (
  charactorForm: CharactorForm,
) => Charactor | DataNotFoundError | NotWearableErorr | EmptyParameter;
export const hireCharactor: HireCharactor = (charactorForm) => {
  const charactorName = charactorForm.name;
  if (!charactorName) {
    return new EmptyParameter("name", `nameがありません`);
  }

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

  return createCharactor(charactorName, race, blessing, clothing, weapon);
};


import { describe, it, expect } from "vitest";

// test hireCharactor
describe("hireCharactor", () => {
  it("should return a charactor", () => {
    const charactorForm = {
      name

// TODO このモジュールは削除して、toCharactorの実装を使うだけにする。
// 本当はformモジュールにもテストを書くべきだが、どうしようかな









