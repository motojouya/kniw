import { FC } from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';
import {
//  Controller,
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  Merge,
  FieldErrorsImpl,
//  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  List,
  ListItem,
//  ListIcon,
//  UnorderedList,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
} from '@chakra-ui/react';
import { JSONSchemaType } from "ajv"

// import { NotApplicable } from 'src/io/standard_dialogue';
import { Acquirement } from 'src/domain/acquirement';
import {
//  getRace,
//  getBlessing,
//  getClothing,
//  getWeapon,
  allRaces,
  allWeapons,
  allClothings,
  allBlessings,
} from 'src/store/acquirement';
// import { NotWearableErorr } from 'src/domain/acquirement';
// import { createCharactor } from 'src/domain/charactor';

// import Link from 'next/link'

// TODO json-schema-to-tsの導入
// import { FromSchema } from 'json-schema-to-ts';
// type CharactorJson = FromSchema<typeof charactorSchema>;
// export type PartyJson = FromSchema<typeof partySchema>;

type CharactorForm = {
  name: string;
  race: string;
  blessing: string;
  clothing: string;
  weapon: string;
};

const charactorFormSchema: JSONSchemaType<CharactorForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    race: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    blessing: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    clothing: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    weapon: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
  },
  required: ['name' , 'race', 'blessing', 'clothing', 'weapon'],
  additionalProperties: false,
} as const;

type PartyForm = {
  name: string;
  charactors: CharactorForm[]
};
const partyFormSchema: JSONSchemaType<PartyForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    charactors: {
      type: 'array',
      items: charactorFormSchema,
    },
  },
  required: ['name', 'charactors'],
} as const;

// const charactorItemId = <T,>(ary: Array<T>, i: number, property: string): string => `charactor.${i}.${property}`;

type GetCharactorError = (errors: FieldErrors, i: number, property: string) => FieldError | undefined;
const getCharactorError: GetCharactorError = (errors, i, property) => {
  const errorsCharactors = errors.charactors;
  if (!errorsCharactors) {
    return errorsCharactors;
  }
  const errorsCharactorIndexed = (errorsCharactors as Merge<FieldError, FieldErrorsImpl<any>>)[i];
  if (!errorsCharactorIndexed) {
    return errorsCharactorIndexed;
  }
  const error = (errorsCharactorIndexed as Merge<FieldError, FieldErrorsImpl<any>>)[property];
  if (!error) {
    return error;
  }

  return error as FieldError;
};

const SelectAcquirement: FC<{
  name: string,
  keyPrefix: string,
  allAcquirements: Acquirement[],
  selectProps: UseFormRegisterReturn,
  error: FieldError | undefined,
}> = ({ name, keyPrefix, allAcquirements, selectProps, error }) => (
  <FormControl isInvalid={!!error}>
    <FormLabel htmlFor={name}>{name}</FormLabel>
    <Select {...selectProps} placeholder={name}>
      {allAcquirements.map(acquirement => (
        <option key={`${keyPrefix}.${acquirement.name}`} value={acquirement.name}>
          {acquirement.label}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{!!error && error.message}</FormErrorMessage>
  </FormControl>
);

const Index: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    // reset,
    // trigger,
    // setError,
  // } = useForm();
  } = useForm<PartyForm>({ resolver: ajvResolver<PartyForm>(partyFormSchema) });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "charactors"
  });

  /* eslint-disable */
  const onSubmit = (values: any) => new Promise(resolve => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      resolve('ok');
    }, 3000);
  });

// TODO Controllerを使うと型が合わない問題
//                    <Controller
//                      id={charactorItemId(fields, index, 'name')}
//                      placeholder="name"
//                      render={({ field }) => <Input {...field} />}
//                      name={charactorItemId(fields, index, 'name')}
//                      control={control}
//                    />

  return (
    <Box p={4}>
      <p>This is the party page</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">name</FormLabel>
          <Input id="name" placeholder="name" {...register('name')} />
          <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
        <List>
          {fields.map((item, index) => {
            const nameError = getCharactorError(errors, index, 'name');
            return (
              <ListItem key={`charactor-${index}`}>
                <Card>
                  <CardHeader>
                    <Button type="button" onClick={() => remove(index)}>Delete</Button>
                  </CardHeader>
                  <CardBody>
                    <FormControl isInvalid={!!nameError}>
                      <FormLabel htmlFor="name">name</FormLabel>
                      <Input {...register(`charactors.${index}.name` as const)} placeholder="name" />
                      <FormErrorMessage>{!!nameError && nameError.message}</FormErrorMessage>
                    </FormControl>
                    <SelectAcquirement
                      name={'race'}
                      keyPrefix={`charactors.${index}.race`}
                      allAcquirements={allRaces}
                      error={getCharactorError(errors, index, 'race')}
                      selectProps={register(`charactors.${index}.race` as const)}
                    />
                    <SelectAcquirement
                      name={'blessing'}
                      keyPrefix={`charactors.${index}.blessing`}
                      allAcquirements={allBlessings}
                      error={getCharactorError(errors, index, 'blessing')}
                      selectProps={register(`charactors.${index}.blessing` as const)}
                    />
                    <SelectAcquirement
                      name={'clothing'}
                      keyPrefix={`charactors.${index}.clothing`}
                      allAcquirements={allClothings}
                      error={getCharactorError(errors, index, 'clothing')}
                      selectProps={register(`charactors.${index}.clothing` as const)}
                    />
                    <SelectAcquirement
                      name={'weapon'}
                      keyPrefix={`charactors.${index}.weapon`}
                      allAcquirements={allWeapons}
                      error={getCharactorError(errors, index, 'weapon')}
                      selectProps={register(`charactors.${index}.weapon` as const)}
                    />
                  </CardBody>
                  <CardFooter>
                    {'status'}
                  </CardFooter>
                </Card>
              </ListItem>
            );
          })}
        </List>
        <Button type="button" onClick={() => append({ name: '', race: '', blessing: '', clothing: '', weapon: '' })} >append</Button>
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">Submit</Button>
      </form>
    </Box>
  );
  /* eslint-enable */
};

export default Index;

