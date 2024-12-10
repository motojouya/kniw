import type { FC } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { Store } from '@motojouya/kniw/src/store/store';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { createStore } from '@motojouya/kniw/src/store/party';
import { createRepository } from '@motojouya/kniw/src/io/indexed_db_repository';
import {
  PartyList,
  PartyNew,
  PartyExsiting,
} from '@motojouya/kniw/src/components/party';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  const [store, setStore] = useState<Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError> | null>(null);
  useEffect(() => {
    (async () => {
      const webRepository = await createRepository();
      const partyStore = await createStore(webRepository);
      setStore(partyStore);
    })();
  }, []);

  if (!store) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!name) {
    return (<PartyList store={store} />);
  }

  if (name === '__new') {
    return <PartyNew store={store} />
  }

  return <PartyExsiting partyName={name} store={store} />
};

export default Index;

