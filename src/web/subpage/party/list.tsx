import type { FC } from 'react';

import { Box, List, ListItem } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";
import { useIO } from '@motojouya/kniw/src/components/context';
import { Link } from '@motojouya/kniw/src/components/utility';

export const PartyList: FC = () => {
  const { partyRepository } = useIO();
  const partyNames = useLiveQuery(() => partyRepository.list(), []);

  return (
    <Box>
      <Link href="/"><span>戻る</span></Link>
      <Box>
        <List>
          <ListItem key='party-new'>
            <a href='/party/?name=__new'>新しく作る</a>
          </ListItem>
          {partyNames && partyNames.map((partyName, index) => (
            <ListItem key={`party-${index}`}>
              <Link href={`/party/?name=${partyName}`}><span>{partyName}</span></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
