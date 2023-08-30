import type { FC } from 'react';
import type { Party } from 'src/domain/party';
import type { Store } from 'src/store/store';

import { useState } from 'react';
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
  PartyEditor,
  PartyExsiting,
} from 'src/components/party';

import Link from 'next/link'

type PartyStore = Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  const [store, setStore] = useState<PartyStore | null>(null);
  useEffect(async () => {
    const webRepository = await createRepository();
    const store = await createStore(repository);
    setStore(store);
  }, []);

  if (!store) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!name) {
    return (<PartyList store={store} />);
  }

  if (name === '_new') {
    return <PartyEditor store={store} />
  }

  return <PartyExsiting partyName={name} store={store} />
};

export default Index;

