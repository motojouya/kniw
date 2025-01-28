import type { FC, ReactNode } from 'react';
import type { Party } from '@motojouya/kniw-core/model/party';
import type { PartyForm } from '../form/party';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Input,
  Button,
  Box,
  List,
  Heading,
  Text,
} from '@chakra-ui/react';

import { Field } from "./ui/field"
import { CharactorCard } from './charactor';
import { partyFormSchema, toPartyForm } from '../form/party';
import { saveParty } from '../procedure/party/save';
import { dismissParty } from '../procedure/party/dismiss';
import { CharactorDuplicationError } from '@motojouya/kniw-core/model/party';
import { NotWearableErorr } from '@motojouya/kniw-core/model/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError, DataExistError } from '@motojouya/kniw-core/store_utility/schema';
import { useIO } from './context';
import { importParty } from '../procedure/party/importJson';
import { UserCancel, EmptyParameter } from '../io/window_dialogue';
import { transit } from './utility';
import { Link } from './utility';

// FIXME subpage/party/newにも似たようなものがあるので共通化したいができるかな。こちらはbattleのparty import用
export const ImportParty: FC<{
  type: string,
  party: Party | null,
  setParty: (party: Party | null) => void,
}> = ({ type, party, setParty }) => {

  const { partyRepository, dialogue } = useIO();
  const importJson = async () => {
    const partyObj = await importParty(dialogue, partyRepository)(undefined);
    if (!(
      partyObj instanceof UserCancel ||
      partyObj instanceof EmptyParameter ||
      partyObj instanceof JsonSchemaUnmatchError ||
      partyObj instanceof NotWearableErorr ||
      partyObj instanceof DataNotFoundError ||
      partyObj instanceof CharactorDuplicationError
    )) {
      setParty(partyObj);
    }
  };

  return (
    <Box>
      {party && <Text>{`${type} Party: ${party.name}`}</Text>}
      <Button type="button" onClick={importJson} >{`Select ${type} Party`}</Button>
    </Box>
  );
};

export const PartyEditor: FC<{
  exist: boolean,
  party: Party,
  inoutButton: ReactNode,
}> = ({ exist, party, inoutButton }) => {

  const { partyRepository, dialogue } = useIO();
  const partyForm = toPartyForm(party);
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

  const save = async (partyInput: PartyForm) => {
    const error = await saveParty(partyRepository, !exist)(partyInput);
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
        transit(`/party/?name=${partyInput.name}`);
      }
    }
  };

  const deleteParty = async (partyName: string) => {
    const result = await dismissParty(dialogue, partyRepository)(partyName);
    if (result) {
      transit('/party/');
    }
  };

  // FIXME messageの表示で以前はFormErrorMessageを使っていたがchakra v3ではなくなったため、一旦Textで代用
  return (
    <Box p={4}>
      <Link href='/party/'><span>戻る</span></Link>
      <Text>This is the party page</Text>
      {inoutButton}
      <form onSubmit={handleSubmit(save)}>
        {saveMessage.message && (
          saveMessage.error
            ? <Text>{saveMessage.message}</Text>
            : <Text>{saveMessage.message}</Text>
        )}
        {exist ? (
          <Box as={'dl'}>
            <Heading as={'dt'}>party name</Heading>
            <Text as={'dd'}>{partyForm.name}</Text>
          </Box>
        ) : (
          <Field invalid={!!errors.name} label="name" errorText={errors.name && errors.name.message}>
            <Input id="name" placeholder="name" {...register('name')} />
          </Field>
        )}
        <List.Root>
          {fields.map((item, index) => (
            <List.Item key={`charactor-${index}`}>
              <CharactorCard register={register} getValues={getValues} remove={remove} errors={errors} index={index} />
            </List.Item>
          ))}
        </List.Root>
        <Button type="button" onClick={() => append({ name: '', race: '', blessing: '', clothing: '', weapon: '' })} >Hire</Button>
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">{exist ? 'Change' : 'Create'}</Button>
        {exist && (
          <Button type="button" onClick={() => deleteParty(partyForm.name)} >Dismiss</Button>
        )}
      </form>
    </Box>
  );
};
