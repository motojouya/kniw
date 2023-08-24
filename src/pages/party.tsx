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
  CardFooter
} from '@chakra-ui/react';
// import Link from 'next/link'
import { JSONSchemaType } from "ajv"

// TODO json-schema-to-tsの導入
// import { FromSchema } from 'json-schema-to-ts';
// type CharactorJson = FromSchema<typeof charactorSchema>;
// export type PartyJson = FromSchema<typeof partySchema>;

type CharactorForm = {
  name: string;
};

const charactorFormSchema: JSONSchemaType<CharactorForm> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'username field is required' },
    },
    // race: {
    //   type: 'string',
    //   minLength: 1,
    //   errorMessage: { minLength: 'username field is required' },
    // },
    // blessing: {
    //   type: 'string',
    //   minLength: 1,
    //   errorMessage: { minLength: 'username field is required' },
    // },
    // clothing: {
    //   type: 'string',
    //   minLength: 1,
    //   errorMessage: { minLength: 'username field is required' },
    // },
    // weapon: {
    //   type: 'string',
    //   minLength: 1,
    //   errorMessage: { minLength: 'username field is required' },
    // },
  },
  required: ['name'],// , 'race', 'blessing', 'clothing', 'weapon'],
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

  const indexReversed = <T,>(ary: Array<T>, i: number): number => (ary.length - i - 1);
  const charactorItemId = <T,>(ary: Array<T>, i: number, property: string): string => `charactor.${indexReversed(ary, i)}.${property}`;
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
          {fields.slice().reverse().map((item, index) => {
            const nameError = getCharactorError(errors, index, 'name');
            return (
              <ListItem key={`charactor-${indexReversed(fields, index)}`}>
                <Card>
                  <CardHeader>{`charactor-${indexReversed(fields, index) + 1}`}</CardHeader>
                  <CardBody>
                    <FormControl isInvalid={!!nameError}>
                      <FormLabel htmlFor="name">name</FormLabel>
                      <Input {...register(`charactors.${indexReversed(fields, index)}.name` as const)} placeholder="name" />
                      <FormErrorMessage>{!!nameError && nameError.message}</FormErrorMessage>
                    </FormControl>
                  </CardBody>
                  <CardFooter>
                    <Button type="button" onClick={() => remove(index)}>Delete</Button>
                  </CardFooter>
                </Card>
              </ListItem>
            );
          })}
        </List>
        <Button type="button" onClick={() => append({ name: '' })} >append</Button>
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">Submit</Button>
      </form>
    </Box>
  );
  /* eslint-enable */
};

export default Index;

