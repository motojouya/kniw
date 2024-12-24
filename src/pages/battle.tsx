import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { createRepository as createBattleRepository } from '@motojouya/kniw/src/store/battle';
import { createRepository as createPartyRepository } from '@motojouya/kniw/src/store/party';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import {
  BattleList,
  BattleNew,
  BattleExsiting,
} from '@motojouya/kniw/src/components/battle';
import { IOProvider } from '@motojouya/kniw/src/components/context';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

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
