import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';
import type { PartyForm } from '@motojouya/kniw/src/form/party';

import { DataExistError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { toParty } from '@motojouya/kniw/src/form/party';

export type SaveParty = (
  repository: Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError>,
  checkExists: boolean,
) => (partyForm: PartyForm) => Promise<null | DataNotFoundError | NotWearableErorr | CharactorDuplicationError | DataExistError>;
export const saveParty: SaveParty = (repository, checkExists) => async partyForm => {
  const party = toParty(partyForm);
  if (
    party instanceof DataNotFoundError ||
    party instanceof NotWearableErorr ||
    party instanceof CharactorDuplicationError
  ) {
    return party;
  }

  if (checkExists) {
    const partyNames = await repository.list();
    if (partyNames.includes(party.name)) {
      return new DataExistError(party.name, 'party', `${party.name}というpartyは既に存在します`);
    }
  }

  await repository.save(party);
  return null;
};
