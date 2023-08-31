import type { Dialogue, SelectOption } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/repository';
import { NotApplicable } from 'src/io/standard_dialogue';
import { createStore } from 'src/store/charactor';
import {
  getRace,
  getBlessing,
  getClothing,
  getWeapon,
  allRaces,
  allWeapons,
  allClothings,
  allBlessings,
} from 'src/store/acquirement';
import { NotWearableErorr } from 'src/domain/acquirement';
import { createCharactor } from 'src/domain/charactor';

export type Hire = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const hire: Hire = (dialogue, repository) => async name => {
  const { notice, select } = dialogue;
  const store = await createStore(repository);

  const charactorNames = await store.list();
  if (charactorNames.includes(name)) {
    await notice(`${name}は既に雇っています`);
  }

  const raceOptions: SelectOption[] = allRaces.map(race => ({ value: race.name, label: race.label }));
  const raceName = await select('種族を選んでください', raceOptions);
  if (!raceName || raceName instanceof NotApplicable) {
    return;
  }
  const race = getRace(raceName);
  if (!race) {
    await notice(`${raceName}という種族は存在しません`);
    return;
  }

  const blessingOptions: SelectOption[] = allBlessings.map(blessing => ({
    value: blessing.name,
    label: blessing.label,
  }));
  const blessingName = await select('種族を選んでください', blessingOptions);
  if (!blessingName || blessingName instanceof NotApplicable) {
    return;
  }
  const blessing = getBlessing(blessingName);
  if (!blessing) {
    await notice(`${blessingName}という祝福は存在しません`);
    return;
  }

  const clothingOptions: SelectOption[] = allClothings.map(clothing => ({
    value: clothing.name,
    label: clothing.label,
  }));
  const clothingName = await select('種族を選んでください', clothingOptions);
  if (!clothingName || clothingName instanceof NotApplicable) {
    return;
  }
  const clothing = getClothing(clothingName);
  if (!clothing) {
    await notice(`${clothingName}という装備は存在しません`);
    return;
  }

  const weaponOptions: SelectOption[] = allWeapons.map(weapon => ({ value: weapon.name, label: weapon.label }));
  const weaponName = await select('種族を選んでください', weaponOptions);
  if (!weaponName || weaponName instanceof NotApplicable) {
    return;
  }
  const weapon = getWeapon(weaponName);
  if (!weapon) {
    await notice(`${weaponName}という種族は存在しません`);
    return;
  }

  const charactor = createCharactor(name, race, blessing, clothing, weapon);

  if (charactor instanceof NotWearableErorr) {
    await notice(charactor.message);
    return;
  }

  await store.save(charactor);
  await notice(`${name}を雇いました`);
};
