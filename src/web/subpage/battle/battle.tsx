import type { FC } from 'react';

import Link from 'next/link'
import { Box, Text } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { NotBattlingError } from '@motojouya/kniw/src/domain/battle';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import { useIO } from '@motojouya/kniw/src/components/context';

export const BattleExsiting: FC<{ battleTitle: string }> = ({ battleTitle }) => {
  const { battleRepository } = useIO();
  const battle = useLiveQuery(() => battleRepository.get(battleTitle), [battleTitle]);

  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError ||
    battle instanceof NotBattlingError
  ) {
    return (
      <Box>
        <Text>{battle.message}</Text>
        <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      </Box>
    );
  }

  if (!battle) {
    return (
      <Box>
        <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
        <Text>{`${battleTitle}というbattleは見つかりません`}</Text>
      </Box>
    );
  }

  return (<BattleTurn battle={battle} />);
};
