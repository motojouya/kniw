import type { FC } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';

import { ImportParty } from '@motojouya/kniw/src/components/party';
import { startBattle } from '@motojouya/kniw/src/web/case/battle/start';
import { useIO } from '@motojouya/kniw/src/components/context';

export const BattleNew: FC<{}> = () => {

  const { battleRepository } = useIO();
  const router = useRouter()

  const [message, setMessage] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string }>();
  const [homeParty, setHomeParty] = useState<Party | null>(null);
  const [visitorParty, setVisitorParty] = useState<Party | null>(null);

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
    await router.push({ pathname: 'battle', query: { title: battle.title } })
  };

  return (
    <Box p={4}>
      <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      <Text>This is the battle page</Text>
      <form onSubmit={handleSubmit(start)}>
        {message && (<FormErrorMessage>{message}</FormErrorMessage>)}
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">title</FormLabel>
          <Input id="title" placeholder="title" {...register('title')} />
          <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
        </FormControl>
        <ImportParty type='HOME' party={homeParty} setParty={setHomeParty}/>
        <ImportParty type='VISITOR' party={visitorParty} setParty={setVisitorParty}/>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">Start Battle</Button>
      </form>
    </Box>
  );
};
