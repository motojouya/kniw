import type { Party } from '@motojouya/kniw/src/domain/party';
import type { PartyForm } from '@motojouya/kniw/src/form/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import { toPartyForm } from '@motojouya/kniw/src/form/party';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

type PartyRepository = Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

export type ImportParty = (dialogue: Dialogue, repository: PartyRepository) => () => Promise<PartyForm | DataNotFoundError | JsonSchemaUnmatchError | NotWearableErorr | CharactorDuplicationError>
export const importParty: ImportParty = (dialogue, repository) => async () => {

    if (!dialogue.confirm('取り込むと入力したデータが削除されますがよいですか？')) {
      return;
    }

    const party = await repository.importJson('');
    if (!party) {
      dialogue.notice('partyがありません');
      // FIXME ユーザからの入力がないのはDataNotFoundErrorは妥当ではない
      return new DataNotFoundError('party', 'party', 'partyがありません');
    }

    if (
      party instanceof JsonSchemaUnmatchError ||
      party instanceof NotWearableErorr ||
      party instanceof DataNotFoundError ||
      party instanceof CharactorDuplicationError
    ) {
      dialogue.notice(party.message);
      return party;
    }

    return toPartyForm(party);
}
