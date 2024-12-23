import type { FC, ReactNode } from 'react';
import type { Party } from '@motojouya/kniw/src/domain/party';
import type { PartyForm } from '@motojouya/kniw/src/form/party';
import type { Repository } from '@motojouya/kniw/src/store/disk_repository';

import { useRouter } from 'next/router'
import Link from 'next/link'

import { CharactorCard } from '@motojouya/kniw/src/components/charactor';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { partyFormSchema, toPartyForm, saveParty } from '@motojouya/kniw/src/form/party';

import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError, DataExistError } from '@motojouya/kniw/src/store/schema/schema';

type PartyRepository = Repository<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

const PartyEditor: FC<{
  exist: boolean,
  partyForm: PartyForm,
  inoutButton: ReactNode,
  repository: PartyRepository,
}> = ({ exist, partyForm, inoutButton, repository }) => {

  const router = useRouter()
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PartyForm>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: partyForm,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "charactors" });
  const [saveMessage, setSaveMessage] = useState<{ error: boolean, message: string }>({ error: false, message: '' });

  const save = async (party: PartyForm) => {
    const error = await saveParty(repository, !exist)(party);
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
        await router.push({ pathname: 'party', query: { name: party.name } })
      }
    }
  };

  const deleteParty = async (partyName: string) => {
    if (window.confirm('削除してもよいですか？')) {
      await repository.remove(partyName);
      await router.push({ pathname: 'party' })
    }
  };

  return (
    <Box p={4}>
      <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      <Text>This is the party page</Text>
      {inoutButton}
      <form onSubmit={handleSubmit(save)}>
        {saveMessage.message && (
          saveMessage.error
            ? <FormErrorMessage>{saveMessage.message}</FormErrorMessage>
            : <Text>{saveMessage.message}</Text>
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

export const PartyExsiting: FC<{ repository: PartyRepository, partyName: string }> = ({ repository, partyName }) => {
  const party = useLiveQuery(() => repository.get(partyName), [partyName]);

  if (
    party instanceof NotWearableErorr ||
    party instanceof DataNotFoundError ||
    party instanceof CharactorDuplicationError ||
    party instanceof JsonSchemaUnmatchError
  ) {
    return (
      <Box>
        <Text>{party.message}</Text>
        <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      </Box>
    );
  }

  if (!party) {
    return (
      <Box>
        <Text>{`${partyName}というpartyは見つかりません`}</Text>
        <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      </Box>
    );
  }

  return (
    <PartyEditor exist={true} partyForm={toPartyForm(party)} repository={repository} inoutButton={(
      <Button type="button" onClick={() => repository.exportJson(party, '')} >Export</Button>
    )} />
  );
};

export const PartyNew: FC<{ repository: PartyRepository }> = ({ repository }) => {

  const [party, setParty] = useState<PartyForm>({ name: '', charactors: [] });
  const importParty = async () => {
    if (!window.confirm('取り込むと入力したデータが削除されますがよいですか？')) {
      return;
    }

    const partyObj = await repository.importJson('');
    if (!partyObj) {
      window.alert('partyがありません');
      return;
    }
    if (
      partyObj instanceof JsonSchemaUnmatchError ||
      partyObj instanceof NotWearableErorr ||
      partyObj instanceof DataNotFoundError ||
      partyObj instanceof CharactorDuplicationError
    ) {
      window.alert(partyObj.message);
      return;
    }

    setParty(toPartyForm(partyObj));
  };

  return (
    <PartyEditor exist={false} partyForm={party} repository={repository} inoutButton={(
      <Button type="button" onClick={importParty} >Import</Button>
    )} />
  );
};

export const PartyList: FC<{ repository: PartyRepository }> = ({ repository }) => {
  const partyNames = useLiveQuery(() => repository.list(), []);
  return (
    <Box>
      <Link href={{ pathname: '/' }}><a>戻る</a></Link>
      <Box>
        <List>
          <ListItem key='party-new'>
            <Link href={{ pathname: 'party', query: { name: '__new' } }}><a>新しく作る</a></Link>
          </ListItem>
          {partyNames && partyNames.map((partyName, index) => (
            <ListItem key={`party-${index}`}>
              <Link href={{ pathname: 'party', query: { name: partyName } }}><a>{partyName}</a></Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

