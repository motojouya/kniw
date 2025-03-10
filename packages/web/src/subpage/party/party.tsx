import type { FC } from 'react';

import { Text, Button } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { PartyEditor } from '../../components/party';
import { CharactorDuplicationError } from '@motojouya/kniw-core/model/party';
import { useIO } from '../../components/context';
import { NotWearableErorr } from '@motojouya/kniw-core/model/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw-core/store_utility/schema';
import { Container, Link, ButtonLink } from '../../components/utility';

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
      <Container backLink="/party/">
        <Text>{party.message}</Text>
      </Container>
    );
  }

  if (!party) {
    return (
      <Container backLink="/party/">
        <Text>{`${partyName}というpartyは見つかりません`}</Text>
      </Container>
    );
  }

  return (
    <PartyEditor exist={true} party={party} inoutButton={(
      <Button type="button" onClick={() => partyRepository.exportJson(party, '')} >Export</Button>
    )} />
  );
};
