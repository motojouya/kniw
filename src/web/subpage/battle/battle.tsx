import type { FC } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { BattleTurn } from '@motojouya/kniw/src/components/battle';
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
        <a href='/battle/'>戻る</a>
      </Box>
    );
  }

  if (!battle) {
    return (
      <Box>
        <a href='/battle/'>戻る</a>
        <Text>{`${battleTitle}というbattleは見つかりません`}</Text>
      </Box>
    );
  }

  return (<BattleTurn battle={battle} />);
};
