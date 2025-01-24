import type { Dialogue, SelectOption } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { NotApplicable } from "../io/standard_dialogue";
import { createRepository } from "@motojouya/kniw-core/store/charactor";
import {
  raceRepository,
  blessingRepository,
  clothingRepository,
  weaponRepository,
} from "@motojouya/kniw-core/store/acquirement";
import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { createCharactor } from "@motojouya/kniw-core/model/charactor";

export type Hire = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const hire: Hire = (dialogue, database) => async (name) => {
  const { notice, select } = dialogue;
  const repository = await createRepository(database);

  const charactorNames = await repository.list();
  if (charactorNames.includes(name)) {
    await notice(`${name}は既に雇っています`);
  }

  const raceOptions: SelectOption[] = raceRepository.all.map((race) => ({ value: race.name, label: race.label }));
  const raceName = await select("種族を選んでください", raceOptions);
  if (!raceName || raceName instanceof NotApplicable) {
    return;
  }
  const race = raceRepository.get(raceName);
  if (!race) {
    await notice(`${raceName}という種族は存在しません`);
    return;
  }

  const blessingOptions: SelectOption[] = blessingRepository.all.map((blessing) => ({
    value: blessing.name,
    label: blessing.label,
  }));
  const blessingName = await select("種族を選んでください", blessingOptions);
  if (!blessingName || blessingName instanceof NotApplicable) {
    return;
  }
  const blessing = blessingRepository.get(blessingName);
  if (!blessing) {
    await notice(`${blessingName}という祝福は存在しません`);
    return;
  }

  const clothingOptions: SelectOption[] = clothingRepository.all.map((clothing) => ({
    value: clothing.name,
    label: clothing.label,
  }));
  const clothingName = await select("種族を選んでください", clothingOptions);
  if (!clothingName || clothingName instanceof NotApplicable) {
    return;
  }
  const clothing = clothingRepository.get(clothingName);
  if (!clothing) {
    await notice(`${clothingName}という装備は存在しません`);
    return;
  }

  const weaponOptions: SelectOption[] = weaponRepository.all.map((weapon) => ({
    value: weapon.name,
    label: weapon.label,
  }));
  const weaponName = await select("種族を選んでください", weaponOptions);
  if (!weaponName || weaponName instanceof NotApplicable) {
    return;
  }
  const weapon = weaponRepository.get(weaponName);
  if (!weapon) {
    await notice(`${weaponName}という種族は存在しません`);
    return;
  }

  const charactor = createCharactor(name, race, blessing, clothing, weapon);

  if (charactor instanceof NotWearableErorr) {
    await notice(charactor.message);
    return;
  }

  await repository.save(charactor);
  await notice(`${name}を雇いました`);
};
