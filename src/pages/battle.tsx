import type { FC } from 'react';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import { Box, Text } from '@chakra-ui/react';

import { createRepository as createBattleRepository } from '@motojouya/kniw/src/store/battle';
import { createRepository as createPartyRepository } from '@motojouya/kniw/src/store/party';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import { dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import { BattleList } from '@motojouya/kniw/src/web/subpage/battle/list';
import { BattleNew } from '@motojouya/kniw/src/web/subpage/battle/new';
import { BattleExsiting } from '@motojouya/kniw/src/web/subpage/battle/battle';
import { IOProvider } from '@motojouya/kniw/src/components/context';

const Index: FC = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

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

  const context = {
    ...repositories,
    dialogue,
  };

  if (!title) {
    return (<IOProvider context={context}><BattleList/></IOProvider>);
  }

  if (title === '__new') {
    return (<IOProvider context={context}><BattleNew/></IOProvider>);
  }

  return (
    <IOProvider context={context}>
      <BattleExsiting battleTitle={title}/>
    </IOProvider>
  );
};

export default Index;
