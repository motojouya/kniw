import type { Dialogue, SelectOption } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import type { Charactor } from "@motojouya/kniw-core/model/charactor";
import { NotApplicable } from "../io/standard_dialogue";
import { createRepository as createCharactorRepository } from "@motojouya/kniw-core/store/charactor";
import { createRepository as createPartyRepository } from "@motojouya/kniw-core/store/party";
import { NotWearableErorr } from "@motojouya/kniw-core/model/acquirement";
import { JsonSchemaUnmatchError, DataNotFoundError } from "@motojouya/kniw-core/store_utility/schema";
import { createParty, CharactorDuplicationError } from "@motojouya/kniw-core/model/party";

export type Change = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const change: Change = (dialogue, database) => async (name) => {
  const { notice, multiSelect } = dialogue;
  const partyRepository = await createPartyRepository(database);
  const charactorRepository = await createCharactorRepository(database);

  const party = await partyRepository.get(name);
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

  let newCharactors: string[] = party.charactors.map((charactor) => charactor.name);

  const fireOptions: SelectOption[] = party.charactors.map((charactor) => ({
    value: charactor.name,
    label: charactor.name,
  }));
  const fireNames = await multiSelect("解雇するメンバーを複数選択してください。", fireOptions.length, fireOptions);
  if (!(fireNames instanceof NotApplicable) && fireNames.length !== 0) {
    newCharactors = newCharactors.filter((newName) => !fireNames.includes(newName));
  }

  const charactorNames = await charactorRepository.list();
  const hireOptions: SelectOption[] = charactorNames
    .filter((charactorName) => !newCharactors.includes(charactorName))
    .map((charactorName) => ({ value: charactorName, label: charactorName }));
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
    const charactor = await charactorRepository.get(newName);
    if (!charactor) {
      await notice(`${newName}というキャラクターはいません`);
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

  const newParty = createParty(name, charactors);
  if (newParty instanceof CharactorDuplicationError) {
    await notice(newParty.message);
    return;
  }

  await partyRepository.save(newParty);
  await notice(`${name}を組み直しました`);
};
