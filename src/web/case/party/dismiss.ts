import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

type PartyRepository = Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

export type DismissParty = (dialogue: Dialogue, repository: PartyRepository) => (name: string) => Promise<boolean>
export const dismissParty: DismissParty = (dialogue, repository) => async (name) => {
  if (!dialogue.confirm('削除してもよいですか？')) {
    return false;
  }
  await repository.remove(partyName);
  return true;
};
