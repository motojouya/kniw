import type { FC } from 'react';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';

import Link from 'next/link'
import { Button, Box, Text } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { toPartyForm } from '@motojouya/kniw/src/form/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { useIO } from '@motojouya/kniw/src/components/context';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

export const PartyExsiting: FC<{ partyName: string }> = ({ partyName }) => {
  const { partyRepository } = useIO();
  const party = useLiveQuery(() => partyRepository.get(partyName), [partyName]);

  if (
    party instanceof NotWearableErorr ||
    party instanceof DataNotFoundError ||
    party instanceof CharactorDuplicationError ||
    party instanceof JsonSchemaUnmatchError
  ) {
    return (
      <Box>
        <Text>{party.message}</Text>
        <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      </Box>
    );
  }

  if (!party) {
    return (
      <Box>
        <Text>{`${partyName}というpartyは見つかりません`}</Text>
        <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      </Box>
    );
  }

  return (
    <PartyEditor exist={true} party={party} inoutButton={(
      <Button type="button" onClick={() => partyRepository.exportJson(party, '')} >Export</Button>
    )} />
  );
};
