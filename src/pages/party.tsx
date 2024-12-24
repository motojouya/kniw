import type { FC } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { createRepository } from '@motojouya/kniw/src/store/party';
import { createDatabase } from '@motojouya/kniw/src/io/indexed_database';
import { dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import {
  PartyList,
  PartyNew,
  PartyExsiting,
} from '@motojouya/kniw/src/components/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  const [repository, setRepository] = useState<Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError> | null>(null);
  useEffect(() => {
    (async () => {
      const indexedDatabase = await createDatabase();
      const partyRepository = await createRepository(indexedDatabase);
      setRepository(partyRepository);
    })();
  }, []);

  if (!repository) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!name) {
    return (<PartyList repository={repository} />);
  }

  if (name === '__new') {
    return <PartyNew repository={repository} dialogue={dialogue} />
  }

  return <PartyExsiting partyName={name} repository={repository} dialogue={dialogue} />
};

export default Index;
