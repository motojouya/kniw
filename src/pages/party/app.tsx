import type { FC } from 'react';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

import { createRepository as createPartyRepository } from '@motojouya/kniw/src/store/party';
import { createRepository as createBattleRepository } from '@motojouya/kniw/src/store/battle';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import { dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import { PartyList } from '@motojouya/kniw/src/web/subpage/party/list';
import { PartyNew } from '@motojouya/kniw/src/web/subpage/party/new';
import { PartyExsiting } from '@motojouya/kniw/src/web/subpage/party/party';
import { IOProvider } from '@motojouya/kniw/src/components/context';
import { getSearchParams } from '@motojouya/kniw/src/components/utility';

export const App: FC = () => {
  const searchParams = getSearchParams();
  const name = searchParams.get('name');

  const [repositories, setRepositories] = useState<{ partyRepository: PartyRepository, battleRepository: BattleRepository } | null>(null);
  useEffect(() => {
    (async () => {
      const indexedDatabase = await createDatabase();
      const partyRepository = await createPartyRepository(indexedDatabase);
      const battleRepository = await createBattleRepository(indexedDatabase);
      setRepositories({ partyRepository, battleRepository });
    })();
  }, []);

  if (!repositories) {
    return (<Box><Text>loading...</Text></Box>);
  }

  const io = {
    ...repositories,
    dialogue,
  };

  if (!name) {
    return (<IOProvider io={io}><PartyList/></IOProvider>);
  }

  if (name === '__new') {
    return (<IOProvider io={io}><PartyNew/></IOProvider>);
  }

  return (
    <IOProvider io={io}>
      <PartyExsiting partyName={name}/>
    </IOProvider>
  );
};
