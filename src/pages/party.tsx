import type { FC } from 'react';
import type { Party } from 'src/domain/party';
import type { Store } from 'src/store/store';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

import { NotWearableErorr } from 'src/domain/acquirement';
import { createStore } from 'src/store/party';
import { createRepository } from 'src/io/indexed_db_repository';
import {
  PartyList,
  PartyNew,
  PartyExsiting,
} from 'src/components/party';
import { CharactorDuplicationError } from 'src/domain/party';
import { JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';

import Link from 'next/link'

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  const [store, setStore] = useState<Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError> | null>(null);
  useEffect(() => {
    (async () => {
      const webRepository = await createRepository();
      const store = await createStore(webRepository);
      setStore(store);
    })();
  }, []);

  if (!store) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!name) {
    return (<PartyList store={store} />);
  }

  if (name === '_new') {
    return <PartyNew store={store} />
  }

  return <PartyExsiting partyName={name} store={store} />
};

export default Index;

