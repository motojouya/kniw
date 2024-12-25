import type { FC } from 'react';

import Link from 'next/link'
import { Box, List, ListItem } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { useIO } from '@motojouya/kniw/src/components/context';

export const BattleList: FC<{}> = () => {
  const { battleRepository } = useIO();
  const battleNames = useLiveQuery(() => battleRepository.list(), []);
  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='battle-new'>
            <Link href={{ pathname: 'battle', query: { title: '__new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {battleNames && battleNames.map((battleTitle: string, index: number) => (
            <ListItem key={`battle-${index}`}>
              <Link href={{ pathname: 'battle', query: { title: battleTitle } }}><a>{battleTitle}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
