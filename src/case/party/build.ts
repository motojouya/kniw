import type { Dialogue, SelectOption } from '@motojouya/kniw/src/io/standard_dialogue';
import type { Database } from '@motojouya/kniw/src/io/database';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';
import { NotApplicable } from '@motojouya/kniw/src/io/standard_dialogue';
import { createRepository as createCharactorRepository } from '@motojouya/kniw/src/store/charactor';
import { createRepository as createPartyRepository } from '@motojouya/kniw/src/store/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { createParty, CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';

export type Build = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const build: Build = (dialogue, database) => async name => {
  const { notice, multiSelect } = dialogue;
  const partyRepository = await createPartyRepository(database);
  const charactorRepository = await createCharactorRepository(database);

  const partyNames = await partyRepository.list();
  if (partyNames.includes(name)) {
    await notice(`${name}というparty名は既に使われています`);
  }

  const charactorNames = await charactorRepository.list();
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
     
    const charactor = await charactorRepository.get(selectedName);
    if (!charactor) {
       
      await notice(`${selectedName}というキャラクターはいません`);
      return;
    }
    if (
      charactor instanceof NotWearableErorr ||
      charactor instanceof DataNotFoundError ||
      charactor instanceof JsonSchemaUnmatchError
    ) {
       
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

  await partyRepository.save(party);
  await notice(`${name}を組みました`);
};
