import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { NotApplicable } from 'src/io/standard_dialogue';
import { createStore } from 'src/store/charactor';
import { createRandoms } from 'src/domain/random';
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

export type Hire = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const hire: Hire = async (dialogue, repository) => name => {
  const store = createStore(repository);

  const raceOptions: SelectOption[] = allRaces.map(race => { value: race.name, label: race.label });
  const raceName = await dialogue.select('種族を選んでください', raceOptions);
  if (!raceName || raceName instanceof NotApplicable) {
    return;
  }

  const confirmAnswer = await dialogue.confirm(`本当に${name}を解雇してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await store.remove(name);

  await dialogue.notice(`${name}を解雇しました。言伝を預かっております。`);
  const randoms = createRandoms();
  const message = byebyeMessages[Math.floor(randoms.accuracy * byebyeMessages.length)];
  await dialogue.notice(`「${message}」とのことです。`);
};


