import type { FC, ReactNode } from 'react';
import type { Battle } from 'src/domain/battle';
import type { BattleForm } from 'src/form/battle';
import type { Store } from 'src/store/store';

import { useRouter } from 'next/router'
import Link from 'next/link'

import { CharactorCard } from 'src/components/charactor';
import { useState } from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  List,
  ListItem,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

import { battleFormSchema, toBattleForm, saveBattle } from 'src/form/battle';
import { importJson } from 'src/io/indexed_db_repository';
import { toBattle as jsonToBattle } from 'src/store/schema/battle';

import { CharactorDuplicationError } from 'src/domain/battle';
import { NotWearableErorr } from 'src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError, DataExistError } from 'src/store/store';

type BattleStore = Store<Battle, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

const BattleEditor: FC<{
  exist: boolean,
  battleForm: BattleForm,
  inoutButton: ReactNode,
  store: BattleStore,
}> = ({ exist, battleForm, inoutButton, store }) => {

  const router = useRouter()
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<BattleForm>({
    resolver: ajvResolver<BattleForm>(battleFormSchema),
    defaultValues: battleForm,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "charactors" });
  const [saveMessage, setSaveMessage] = useState<{ error: boolean, message: string }>({ error: false, message: '' });

  const save = async (battle: any) => {
    const error = await saveBattle(store, !exist)(battle);
    if (
      error instanceof DataNotFoundError ||
      error instanceof NotWearableErorr ||
      error instanceof JsonSchemaUnmatchError ||
      error instanceof CharactorDuplicationError ||
      error instanceof DataExistError
    ) {
      setSaveMessage({
        error: true,
        message: error.message,
      });
    } else {
      if (exist) {
        setSaveMessage({
          error: false,
          message: '保存しました',
        });
      } else {
        const saved = battle as BattleForm;
        await router.push({ pathname: 'battle', query: { name: saved.name } })
      }
    }
  };

  const deleteBattle = async (battleName: string) => {
    if (window.confirm('削除してもよいですか？')) {
      await store.remove(battleName);
      await router.push({ pathname: 'battle' })
    }
  };

  return (
    <Box p={4}>
      <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      <Text>This is the battle page</Text>
      {inoutButton}
      <form onSubmit={handleSubmit(save)}>
        {saveMessage.message && (
          saveMessage.error
            ? <FormErrorMessage>{saveMessage.message}</FormErrorMessage>
            : <Text>{saveMessage.message}</Text>
        )}
        {exist ? (
          <Box as={'dl'}>
            <Heading as={'dt'}>battle name</Heading>
            <Text as={'dd'}>{battleForm.name}</Text>
          </Box>
        ) : (
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">name</FormLabel>
            <Input id="name" placeholder="name" {...register('name')} />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>
        )}
        <List>
          {fields.map((item, index) => (
            <ListItem key={`charactor-${index}`}>
              <CharactorCard register={register} getValues={getValues} remove={remove} errors={errors} index={index} />
            </ListItem>
          ))}
        </List>
        <Button type="button" onClick={() => append({ name: '', race: '', blessing: '', clothing: '', weapon: '' })} >Hire</Button>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">{exist ? 'Change' : 'Create'}</Button>
        {exist && (
          <Button type="button" onClick={() => deleteBattle(battleForm.name)} >Dismiss</Button>
        )}
      </form>
    </Box>
  );
};

export const BattleExsiting: FC<{ store: BattleStore, battleName: string }> = ({ store, battleName }) => {
  const battle = useLiveQuery(() => store.get(battleName), [battleName]);

  if (!store.exportJson) {
    throw new Error('invalid store');
  }

  if (
    battle instanceof NotWearableErorr ||
    battle instanceof DataNotFoundError ||
    battle instanceof CharactorDuplicationError ||
    battle instanceof JsonSchemaUnmatchError
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
        <Text>{`${battleName}というbattleは見つかりません`}</Text>
        <Link href={{ pathname: 'battle' }}><a>戻る</a></Link>
      </Box>
    );
  }

  return (
    <BattleEditor exist={true} battleForm={toBattleForm(battle)} store={store} inoutButton={(
      <Button type="button" onClick={() => store.exportJson && store.exportJson(battle.name, '')} >Export</Button>
    )} />
  );
};

export const BattleNew: FC<{ store: BattleStore }> = ({ store }) => {

  const [battle, setBattle] = useState<BattleForm>({ name: '', charactors: [] });
  const importBattle = async () => {
    if (!window.confirm('取り込むと入力したデータが削除されますがよいですか？')) {
      return;
    }

    const battleJson = await importJson();
    const battleObj = jsonToBattle(battleJson);
    if (
      battleObj instanceof NotWearableErorr ||
      battleObj instanceof DataNotFoundError ||
      battleObj instanceof CharactorDuplicationError ||
      battleObj instanceof JsonSchemaUnmatchError
    ) {
      window.alert(battleObj.message);
      return;
    }

    setBattle(toBattleForm(battleObj));
  };

  return (
    <BattleEditor exist={false} battleForm={battle} store={store} inoutButton={(
      <Button type="button" onClick={importBattle} >Import</Button>
    )} />
  );
};

export const BattleList: FC<{ store: BattleStore }> = ({ store }) => {
  const battleNames = useLiveQuery(() => store.list(), []);
  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='battle-new'>
            <Link href={{ pathname: 'battle', query: { name: '_new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {battleNames && battleNames.map((battleName, index) => (
            <ListItem key={`battle-${index}`}>
              <Link href={{ pathname: 'battle', query: { name: battleName } }}><a>{battleName}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

