import { FC } from "react"
// import { ajvResolver } from '@hookform/resolvers/ajv';
import { useForm } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
} from '@chakra-ui/react'
// import Link from 'next/link'

// TODO 型エラー type: 'string' がダメって怒られる
//export const charactorSchema = {
//  type: 'object',
//  properties: {
//    name: {
//      type: 'string',
//      minLength: 1,
//      errorMessage: { minLength: 'username field is required' },
//    },
//    //race: {
//    //  type: 'string',
//    //  minLength: 1,
//    //  errorMessage: { minLength: 'username field is required' },
//    //},
//    //blessing: {
//    //  type: 'string',
//    //  minLength: 1,
//    //  errorMessage: { minLength: 'username field is required' },
//    //},
//    //clothing: {
//    //  type: 'string',
//    //  minLength: 1,
//    //  errorMessage: { minLength: 'username field is required' },
//    //},
//    //weapon: {
//    //  type: 'string',
//    //  minLength: 1,
//    //  errorMessage: { minLength: 'username field is required' },
//    //},
//  },
//  required: ['name'],//, 'race', 'blessing', 'clothing', 'weapon'],
//  additionalProperties: false,
//} as const;

const Index: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  //} = useForm({ resolver: ajvResolver(charactorSchema) });

  const onSubmit = (values: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resolve('ok')
      }, 3000)
    })
  }

  return (
    <Box p={4}>
      <p>This is the party page</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor='name'>First name</FormLabel>
          <Input id='name' placeholder='name' {...register('name')} />
          <FormErrorMessage>{!!errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>Submit</Button>
      </form>
    </Box>
  )
}

export default Index;
