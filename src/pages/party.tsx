import { FC } from 'react';
import { ajvResolver } from '@hookform/resolvers/ajv';
import {
  Controller,
  useForm,
  useFieldArray,
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
  ListIcon,
  UnorderedList,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@chakra-ui/react';
// import Link from 'next/link'
import { FromSchema } from 'json-schema-to-ts';

export const charactorSchema = {
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

type CharactorJson = FromSchema<typeof charactorSchema>;

export const partySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    charactors: { type: 'array', items: charactorSchema },
  },
  required: ['name', 'charactors'],
} as const;

export type PartyJson = FromSchema<typeof partySchema>;

const Index: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    // reset,
    // trigger,
    // setError,
  } = useForm<PartyJson>({ resolver: ajvResolver<PartyJson>(partySchema) });

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

  type IndexReversed = (ary: Array, i: number) => number;
  const indexReversed: IndexReversed = (ary, i) => (fields.length - i - 1);

  const charactorItemId = (ary, i, property) => `charactor.${indexReversed(ary, i)}.${property}`;

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
          {fields.slice().reverse().map((item, index) => (
            <ListItem key={`charactor-${indexReversed(fields, index)}`}>
              <Card>
                <CardHeader>{`charactor-${indexReversed(fields, index) + 1}`}</CardHeader>
                <CardBody>
                  <FormControl isInvalid={errors[charactorItemId(fields, index, 'name')]}>
                    <FormLabel htmlFor="name">name</FormLabel>
                    <Controller
                      id={charactorItemId(fields, index, 'name')}
                      placeholder="name"
                      render={({ field }) => <Input {...field} />}
                      name={charactorItemId(fields, index, 'name')}
                      control={control}
                    />
                    <FormErrorMessage>{errors[charactorItemId(fields, index, 'name')] && errors[charactorItemId(fields, index, 'name')].message}</FormErrorMessage>
                  </FormControl>
                </CardBody>
                <CardFooter>
                  <Button type="button" onClick={() => remove(index)}>Delete</Button>
                </CardFooter>
              </Card>
            <ListItem>
          ))}
        </List>
        <Button type="button" onClick={() => append({ name: '' })} >append</Button>
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">Submit</Button>
      </form>
    </Box>
  );
  /* eslint-enable */
};

export default Index;
