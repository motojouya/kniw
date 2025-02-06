import type { FC } from 'react';
import type { Party } from '@motojouya/kniw-core/model/party';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Box, Text } from '@chakra-ui/react';
import { Field } from "../../components/ui/field"

import { ImportParty } from '../../components/party';
import { startBattle } from '../../procedure/battle/start';
import { useIO } from '../../components/context';
import { transit } from '../../components/utility';
import { Link } from '../../components/utility';

export const BattleNew: FC = () => {

  const { battleRepository } = useIO();

  const [message, setMessage] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors }, //, isSubmitting
  } = useForm<{ title: string }>();
  const [homeParty, setHomeParty] = useState<Party | null>(null);
  const [visitorParty, setVisitorParty] = useState<Party | null>(null);

  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const start = async (battleTitle: any) => {
    const messages: string[] = [];

    const { title } = battleTitle;
    if (!title) {
      messages.push('titleを入力してください');
    }
    if (!homeParty) {
      messages.push('home partyを入力してください');
    }
    if (!visitorParty) {
      messages.push('visitor partyを入力してください');
    }

    if (messages.length > 0) {
      setMessage(messages.join('\n'));
      return;
    }

    const battle = await startBattle(battleRepository)(title as string, homeParty as Party, visitorParty as Party, new Date());
    transit(`/battle/?title=${battle.title}`);
  };

  // FIXME messageの表示で以前はFormErrorMessageを使っていたがchakra v3ではなくなったため、一旦Textで代用
  // FIXME Button loading={isSubmitting} loadingText="Starting Battle..." としたかったがloadingがエラーになる
  return (
    <Box p={4}>
      <Link href="/battle/"><span>戻る</span></Link>
      <Text>This is the battle page</Text>
      <form onSubmit={handleSubmit(start)}>
        {message && (<Text>{message}</Text>)}
        <Field label="title" invalid={!!errors.title} errorText={errors.title && errors.title.message}>
          <Input id="title" placeholder="title" {...register('title')} />
        </Field>
        <ImportParty type='HOME' party={homeParty} setParty={setHomeParty}/>
        <ImportParty type='VISITOR' party={visitorParty} setParty={setVisitorParty}/>
        <Button colorScheme="teal" type="submit">Start Battle</Button>
      </form>
    </Box>
  );
};
