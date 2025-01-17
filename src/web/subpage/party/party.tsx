import type { FC } from 'react';

import { Button, Box, Text } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { PartyEditor } from '@motojouya/kniw/src/components/party';
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
        <a href='/party/'>戻る</a>
      </Box>
    );
  }

  if (!party) {
    return (
      <Box>
        <Text>{`${partyName}というpartyは見つかりません`}</Text>
        <a href='/party/'>戻る</a>
      </Box>
    );
  }

  return (
    <PartyEditor exist={true} party={party} inoutButton={(
      <Button type="button" onClick={() => partyRepository.exportJson(party, '')} >Export</Button>
    )} />
  );
};
