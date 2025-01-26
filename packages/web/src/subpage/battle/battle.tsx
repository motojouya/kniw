import type { FC } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { BattleTurn } from '../../components/battle';
import { NotBattlingError } from '@motojouya/kniw-core/model/battle';
import { CharactorDuplicationError } from '@motojouya/kniw-core/model/party';
import { NotWearableErorr } from '@motojouya/kniw-core/model/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw-core/store_utility/schema';
import { useIO } from '../../components/context';
import { Link } from '../../components/utility';

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
        <Link href='/battle/'><span>戻る</span></Link>
      </Box>
    );
  }

  if (!battle) {
    return (
      <Box>
        <Link href='/battle/'><span>戻る</span></Link>
        <Text>{`${battleTitle}というbattleは見つかりません`}</Text>
      </Box>
    );
  }

  return (<BattleTurn battle={battle} />);
};
