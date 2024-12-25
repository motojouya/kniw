import type { FC } from 'react';

import Link from 'next/link'
import { Box, List, ListItem } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";
import { useIO } from '@motojouya/kniw/src/components/context';

export const PartyList: FC<{}> = () => {
  const { partyRepository } = useIO();
  const partyNames = useLiveQuery(() => partyRepository.list(), []);

  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='party-new'>
            <Link href={{ pathname: 'party', query: { name: '__new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {partyNames && partyNames.map((partyName, index) => (
            <ListItem key={`party-${index}`}>
              <Link href={{ pathname: 'party', query: { name: partyName } }}><a>{partyName}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
