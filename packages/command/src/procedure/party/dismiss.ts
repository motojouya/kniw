import type { Dialogue } from "../io/standard_dialogue";
import type { Database } from "@motojouya/kniw-core/io/database";
import { NotApplicable } from "../io/standard_dialogue";
import { createRepository } from "@motojouya/kniw-core/store/party";

export type Dismiss = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const dismiss: Dismiss = (dialogue, database) => async (name) => {
  const repository = await createRepository(database);
  const confirmAnswer = await dialogue.confirm(`本当に${name}を解散してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await repository.remove(name);
  await dialogue.notice(`${name}を解散しました`);
};
