import type { Dialogue, SelectOption } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import type { Charactor } from 'src/domain/charactor';
import { NotApplicable } from 'src/io/standard_dialogue';
import { createStore as createCharactorStore } from 'src/store/charactor';
import { createStore as createPartyStore } from 'src/store/party';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { createParty, CharactorDuplicationError } from 'src/domain/party';

export type Change = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const change: Change = (dialogue, repository) => async name => {
  const { notice, multiSelect } = dialogue;
  const partyStore = await createPartyStore(repository);
  const charactorStore = await createCharactorStore(repository);

  const party = await partyStore.get(name);
  if (!party) {
    await notice(`${name}というpartyは存在しません`);
    return;
  }
  if (
    party instanceof NotWearableErorr ||
    party instanceof DataNotFoundError ||
    party instanceof CharactorDuplicationError ||
    party instanceof JsonSchemaUnmatchError
  ) {
    await notice(`${name}は不正なデータです。取り出せません。`);
    return;
  }

  let newCharactors: string[] = party.charactors.map(charactor => charactor.name);

  const fireOptions: SelectOption[] = party.charactors.map(charactor => ({
    value: charactor.name,
    label: charactor.name,
  }));
  const fireNames = await multiSelect('解雇するメンバーを複数選択してください。', fireOptions.length, fireOptions);
  if (!(fireNames instanceof NotApplicable) && fireNames.length !== 0) {
    newCharactors = newCharactors.filter(newName => !fireNames.includes(newName));
  }

  const charactorNames = await charactorStore.list();
  const hireOptions: SelectOption[] = charactorNames
    .filter(charactorName => !newCharactors.includes(charactorName))
    .map(charactorName => ({ value: charactorName, label: charactorName }));
  const hirableCount = 12 - newCharactors.length;
  const hireNames = await multiSelect(
    `雇うメンバーを複数選択してください。partyの残席は${hirableCount}名です。`,
    hirableCount,
    hireOptions,
  );
  if (!(hireNames instanceof NotApplicable) && hireNames.length !== 0) {
    newCharactors = newCharactors.concat(hireNames);
  }

  const charactors: Charactor[] = [];
  for (const newName of newCharactors) {
    // eslint-disable-next-line no-await-in-loop
    const charactor = await charactorStore.get(newName);
    if (!charactor) {
      // eslint-disable-next-line no-await-in-loop
      await notice(`${newName}というキャラクターはいません`);
      return;
    }
    if (
      charactor instanceof NotWearableErorr ||
      charactor instanceof DataNotFoundError ||
      charactor instanceof JsonSchemaUnmatchError
    ) {
      // eslint-disable-next-line no-await-in-loop
      await notice(charactor.message);
      return;
    }
    charactors.push(charactor);
  }

  const newParty = createParty(name, charactors);
  if (newParty instanceof CharactorDuplicationError) {
    await notice(newParty.message);
    return;
  }

  await partyStore.save(newParty);
  await notice(`${name}を組み直しました`);
};
