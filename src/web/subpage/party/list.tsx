import type { FC } from 'react';

import { Box, List, ListItem } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";
import { useIO } from '@motojouya/kniw/src/components/context';

export const PartyList: FC<{}> = () => {
  const { partyRepository } = useIO();
  const partyNames = useLiveQuery(() => partyRepository.list(), []);

  return (
    <Box>
      <a href='/'>戻る</a>
      <Box>
        <List>
          <ListItem key='party-new'>
            <a href='/party/?name=__new'>新しく作る</a>
          </ListItem>
          {partyNames && partyNames.map((partyName, index) => (
            <ListItem key={`party-${index}`}>
              <a href={`/party/?name=${partyName}`}>{partyName}</a>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
