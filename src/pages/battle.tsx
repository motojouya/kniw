import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';
import type { Database } from '@motojouya/kniw/src/io/database';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { createRepository } from '@motojouya/kniw/src/store/battle';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import {
  BattleList,
  BattleNew,
  BattleExsiting,
} from '@motojouya/kniw/src/components/battle';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';

const Index: FC = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  const [repository, setRepository] = useState<Repository<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError> | null>(null);
  useEffect(() => {
    (async () => {
      const indexedDabase = await createDatabase();
      const battleRepository = await createRepository(indexedDabase);
      setRepository(battleRepository);
    })();
  }, []);

  if (!repository) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!title) {
    return (<BattleList repository={repository} />);
  }

  if (title === '__new') {
    return <BattleNew repository={repository} />
  }

  return <BattleExsiting battleTitle={title} repository={repository} />
};

export default Index;

