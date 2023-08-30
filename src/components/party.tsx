import type { FC, ReactNode } from 'react';
import type { PartyForm } from 'src/form/party';

import { useRouter } from 'next/router'
import Link from 'next/link'

import { CharactorCard } from 'src/components/charactor';
import { useState } from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  FormErrorMessage,
  FormMessage,
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

import { toPartyForm, saveParty } from 'src/form/party';
import { importJson } from 'src/io/indexed_db_repository';
import { toParty as jsonToParty } from 'src/store/schema/party';

const PartyEditor: FC<{
  exist: boolean,
  partyForm: PartyForm,
  inoutButton: ReactNode,
  store: PartyStore,
}> = ({ exist, partyForm, store }) => {

  const router = useRouter()
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PartyForm>({
    resolver: ajvResolver<PartyForm>(partyFormSchema),
    defaultValues: partyForm,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "charactors" });
  const [saveMessage, setSaveMessage] = useState<{ error: boolean, message: string }>({ error: false, message: '' });

  const save = async (party: any) => {
    const error = await saveParty(store, !exist)(party);
    if (!error) {
      setSaveMessage({
        error: true,
        message: error.message,
      });
    } else {
      if (exist) {
        setSaveMessage({
          error: false
          message: '保存しました',
        });
      } else {
        const saved = party as PartyForm;
        e.preventDefault()
        router.push({ pathname: 'party', query: { name: saved.name } })
      }
    }
  };

  const deleteParty = (name: string) => {
    if (comfirm('削除してもよいですか？')) {
      store.delete(party.name);
      e.preventDefault()
      router.push({ pathname: 'party' })
    }
  };

  /* eslint-disable @typescript-eslint/no-misused-promises */
  /* eslint-enable @typescript-eslint/no-misused-promises */
  return (
    <Box p={4}>
      <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      <Text>This is the party page</Text>
      {inoutButton}
      <Button type="button" onClick={() => store.copy(party.name)} >Export</Button>
      <form onSubmit={handleSubmit(save)}>
        {saveMessage.message && (
          saveMessage.error
            ? <FormErrorMessage>{saveMessage.message}</FormErrorMessage>
            : <FormMessage>{saveMessage.message}</FormMessage>
        )}
        {exist ? (
          <Box as={'dl'}>
            <Heading as={'dt'}>party name</Heading>
            <Text as={'dd'}>{partyForm.name}</Text>
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
          <Button type="button" onClick={() => deleteParty(partyForm.name)} >Dismiss</Button>
        )}
      </form>
    </Box>
  );
};

export const PartyExsiting: FC<{ store: PartyStore, partyName: string }> = ({ store, partyName }) => {
  const party = useLiveQuery(() => store.get(partyName), [partyName]);

  if (!party) {
    return (
      <Box>
        <Text>{`${partyName}というpartyは見つかりません`}</Text>
        <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      </Box>
    );
  }

  return (
    <PartyEditor exist={true} partyForm={toPartyForm(party)} store={store} inoutButton={(
      <Button type="button" onClick={() => store.copy(party.name, '')} >Export</Button>
    )} />
  );
};

export const PartyNew: FC<{ store: PartyStore }> = ({ store }) => {

  const [party, setParty] = useState<PartyForm>({ name: '', charactors: [] });
  const importParty = async () => {
    if (!comfirm('取り込むと入力したデータが削除されますがよいですか？')) {
      return;
    }

    const partyJson = await importJson();
    const party = jsonToParty(partyJson);
    if (
      party instanceof NotWearableErorr ||
      party instanceof DataNotFoundError ||
      party instanceof CharactorDuplicationError ||
      party instanceof JsonSchemaUnmatchError
    ) {
      alert(party.message);
      return;
    }

    setParty(toPartyForm(party));
  };

  return (
    <PartyEditor exist={false} partyForm={party} store={store} inoutButton={(
      <Button type="button" onClick={importParty} >Import</Button>
    )} />
  );
};

export const PartyList: FC<{ store: PartyStore }> = ({ store }) => {
  const partyNames = useLiveQuery(() => store.list(), []);
  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='party-new'>
            <Link href={{ pathname: 'party', query: { name: '_new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {partyNames.map((partyName, index) => (
            <ListItem key={`party-${index}`}>
              <Link href={{ pathname: 'party', query: { name: partyName } }}><a>{partyName}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

