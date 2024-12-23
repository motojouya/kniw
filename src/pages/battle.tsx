import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';

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
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

type Repositories = {
  battle: Repository<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError>,
  party: Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>,
};

const Index: FC = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  const [repositories, setRepositories] = useState<Repositories | null>(null);
  useEffect(() => {
    (async () => {
      const indexedDabase = await createDatabase();
      const battleRepository = await createBattleRepository(indexedDabase);
      const partyRepository = await createPartyRepository(indexedDabase);
      setRepositories({
        battle: battleRepository,
        party: partyRepository,
      });
    })();
  }, []);

  if (!repositories) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!title) {
    return (<BattleList repository={repositories.battle} />);
  }

  if (title === '__new') {
    return <BattleNew battleRepository={repositories.battle} partyRepository={repositories.party} />
  }

  return <BattleExsiting battleTitle={title} repository={repositories.battle} />
};

export default Index;

