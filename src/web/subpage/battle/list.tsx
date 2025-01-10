import type { FC } from 'react';

import { Box, List, ListItem } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { useIO } from '@motojouya/kniw/src/components/context';

export const BattleList: FC = () => {
  const { battleRepository } = useIO();
  const battleNames = useLiveQuery(() => battleRepository.list(), []);
  return (
    <Box>
      <a href='/'>戻る</a>
      <Box>
        <List>
          <ListItem key='battle-new'>
            <a href='/battle/?title=__new'>新しく作る</a>
          </ListItem>
          {battleNames && battleNames.map((battleTitle: string, index: number) => (
            <ListItem key={`battle-${index}`}>
              <a href={`/battle/?title=${battleTitle}`}>{battleTitle}</a>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
