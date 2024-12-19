import type { FC } from 'react';
import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { Store } from '@motojouya/kniw/src/store/store';
import type { Repository } from '@motojouya/kniw/src/io/repository';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Box,
//  Heading,
  Text,
} from '@chakra-ui/react';

import { createStore } from '@motojouya/kniw/src/store/battle';
import { createRepository } from '@motojouya/kniw/src/io/indexed_db_repository';
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

  const [store, setStore] = useState<Store<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError | NotBattlingError> | null>(null);
  useEffect(() => {
    (async () => {
      const webRepository = await createRepository();
      const battleStore = await createStore(webRepository);
      setStore(battleStore);
    })();
  }, []);

  if (!store) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!title) {
    return (<BattleList store={store} />);
  }

  if (title === '__new') {
    return <BattleNew store={store} />
  }

  return <BattleExsiting battleTitle={title} store={store} />
};

export default Index;

