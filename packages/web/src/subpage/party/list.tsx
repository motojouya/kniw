import type { FC } from 'react';

import { Box, List } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";
import { useIO } from '../../components/context';
import { Link } from '../../components/utility';

export const PartyList: FC = () => {
  const { partyRepository } = useIO();
  const partyNames = useLiveQuery(() => partyRepository.list(), []);

  return (
    <Box>
      <Link href="/"><span>戻る</span></Link>
      <Box>
        <List.Root>
          <List.Item key='party-new'>
            <Link href='/party/?name=__new'><span>新しく作る</span></Link>
          </List.Item>
          {partyNames && partyNames.map((partyName, index) => (
            <List.Item key={`party-${index}`}>
              <Link href={`/party/?name=${partyName}`}><span>{partyName}</span></Link>
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Box>
  );
};
