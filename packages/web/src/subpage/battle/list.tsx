import type { FC } from 'react';

import { Box, List } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { useIO } from '../../components/context';
import { Link } from '../../components/utility';

export const BattleList: FC = () => {
  const { battleRepository } = useIO();
  const battleNames = useLiveQuery(() => battleRepository.list(), []);
  return (
    <Box>
      <Link href="/"><span>戻る</span></Link>
      <Box>
        <List.Root>
          <List.Item key='battle-new'>
            <Link href="/battle/?title=__new"><span>新しく作る</span></Link>
          </List.Item>
          {battleNames && battleNames.map((battleTitle: string, index: number) => (
            <List.Item key={`battle-${index}`}>
              <Link href={`/battle/?title=${battleTitle}`}><span>{battleTitle}</span></Link>
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Box>
  );
};
