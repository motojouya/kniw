import type { FC } from 'react';

import {
  Box,
  Flex,
  Text,
  List,
} from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";
import { useIO } from '../../components/context';
import { Container, Link, ButtonLink } from '../../components/utility';

export const PartyList: FC = () => {
  const { partyRepository } = useIO();
  const partyNames = useLiveQuery(() => partyRepository.list(), []);

  return (
    <Container backLink="/">
      <Flex direction="column" justify="flex-start" align="center">
        <Flex p='3' justify='space-between' w="100%">
          <Text>パーティ一覧</Text>
          <ButtonLink href='/party/?name=__new'><Text>新しく作る</Text></ButtonLink>
        </Flex>
        <List.Root w="100%">
          {partyNames && partyNames.map((partyName, index) => (
            <List.Item key={`party-${index}`} listStyle='none' py='1' px='5'>
              <Link href={`/party/?name=${partyName}`} line><Text>{partyName}</Text></Link>
            </List.Item>
          ))}
        </List.Root>
      </Flex>
    </Container>
  );
};
