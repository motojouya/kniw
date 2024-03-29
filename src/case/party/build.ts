import type { Dialogue, SelectOption } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/repository';
import type { Charactor } from 'src/domain/charactor';
import { NotApplicable } from 'src/io/standard_dialogue';
import { createStore as createCharactorStore } from 'src/store/charactor';
import { createStore as createPartyStore } from 'src/store/party';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { createParty, CharactorDuplicationError } from 'src/domain/party';

export type Build = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const build: Build = (dialogue, repository) => async name => {
  const { notice, multiSelect } = dialogue;
  const partyStore = await createPartyStore(repository);
  const charactorStore = await createCharactorStore(repository);

  const partyNames = await partyStore.list();
  if (partyNames.includes(name)) {
    await notice(`${name}というparty名は既に使われています`);
  }

  const charactorNames = await charactorStore.list();
  const charactorOptions: SelectOption[] = charactorNames.map(charactorName => ({
    value: charactorName,
    label: charactorName,
  }));

  const selectedNames = await multiSelect(
    'メンバーを複数選択してください。partyの最大は12名までです。',
    12,
    charactorOptions,
  );
  if (selectedNames instanceof NotApplicable || selectedNames.length === 0) {
    return;
  }

  const charactors: Charactor[] = [];
  for (const selectedName of selectedNames) {
    // eslint-disable-next-line no-await-in-loop
    const charactor = await charactorStore.get(selectedName);
    if (!charactor) {
      // eslint-disable-next-line no-await-in-loop
      await notice(`${selectedName}というキャラクターはいません`);
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

  const party = createParty(name, charactors);
  if (party instanceof CharactorDuplicationError) {
    await notice(party.message);
    return;
  }

  await partyStore.save(party);
  await notice(`${name}を組みました`);
};
