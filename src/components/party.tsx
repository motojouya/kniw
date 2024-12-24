import type { FC, ReactNode } from 'react';
import type { PartyForm } from '@motojouya/kniw/src/form/party';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';

import { useRouter } from 'next/router'
import Link from 'next/link'
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

import { CharactorCard } from '@motojouya/kniw/src/components/charactor';
import { partyFormSchema } from '@motojouya/kniw/src/form/party';
import { saveParty } from '@motojouya/kniw/src/web/case/party/save';
import { dismissParty } from '@motojouya/kniw/src/web/case/party/dismiss';
import { CharactorDuplicationError } from '@motojouya/kniw/src/domain/party';
import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError, DataExistError } from '@motojouya/kniw/src/store/schema/schema';
import { useIO } from '@motojouya/kniw/src/components/context';

const PartyEditor: FC<{
  exist: boolean,
  partyForm: PartyForm,
  inoutButton: ReactNode,
}> = ({ exist, partyForm, inoutButton }) => {

  const router = useRouter()
  const { partyRepository, dialogue } = useIO();
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
    const error = await saveParty(partyRepository, !exist)(party);
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
    const result = await dismissParty(dialogue, partyRepository)(partyName);
    if (result) {
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
