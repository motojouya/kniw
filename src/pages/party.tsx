import type { FC } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { createPartyRepository } from '@motojouya/kniw/src/store/party';
import { createBattleRepository } from '@motojouya/kniw/src/store/battle';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import { dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import {
  PartyList,
  PartyNew,
  PartyExsiting,
} from '@motojouya/kniw/src/components/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { IOProvider } from '@motojouya/kniw/src/components/context';

const Index: FC = () => {
  const searchParams = useSearchParams();
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

  const context = {
    ...repositories,
    dialogue,
  };

  if (!name) {
    return (<IOProvider context={context}><PartyList/></IOProvider>);
  }

  if (name === '__new') {
    return (<IOProvider context={context}><PartyNew/></IOProvider>);
  }

  return (
    <IOProvider context={context}>
      <PartyExsiting partyName={name}/>
    </IOProvider>
  );
};

export default Index;
