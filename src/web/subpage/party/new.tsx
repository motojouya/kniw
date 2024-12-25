import type { FC } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';

import { importParty } from '@motojouya/kniw/src/web/case/party/importJson';
import { useIO } from '@motojouya/kniw/src/components/context';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { EmptyParameter } from '@motojouya/kniw/src/io/window_dialogue';

export const PartyNew: FC = () => {

  const { partyRepository, dialogue } = useIO();
  const [party, setParty] = useState<Party>({ name: '', charactors: [] });

  const importJson = async () => {
    const partyObj = await importParty(dialogue, partyRepository)('取り込むと入力したデータが削除されますがよいですか？');
    if (!(
      partyObj instanceof EmptyParameter ||
      partyObj instanceof JsonSchemaUnmatchError ||
      partyObj instanceof NotWearableErorr ||
      partyObj instanceof DataNotFoundError ||
      partyObj instanceof CharactorDuplicationError
    )) {
      setParty(partyObj);
    }
  };

  return (
    <PartyEditor exist={false} party={party} inoutButton={(
      <Button type="button" onClick={importJson} >Import</Button>
    )} />
  );
};
