import { FC } from 'react';
// import { ajvResolver } from '@hookform/resolvers/ajv';
// import { useForm } from 'react-hook-form';
// import { FormErrorMessage, FormLabel, FormControl, Input, Button, Box } from '@chakra-ui/react';
// import Link from 'next/link'

// TODO 型エラー type: 'string' がダメって怒られる
// export const charactorSchema = {
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
// } as const;

// Type error: Type 'string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined' is not assignable to type 'ReactNode'.
//   Type 'FieldError' is not assignable to type 'ReactNode'.
//     Type 'FieldError' is missing the following properties from type 'ReactPortal': key, children, props
// 
// Type error: Argument of type '{ readonly type: "object"; readonly properties: { readonly name: { readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }; }; readonly required: readonly [...]; readonly additionalProperties: false; }' is not assignable to parameter of type 'UncheckedJSONSchemaType<{ name: any; }, false>'.
//   Type '{ readonly type: "object"; readonly properties: { readonly name: { readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }; }; readonly required: readonly [...]; readonly additionalProperties: false; }' is not assignable to type '{ type: "object"; additionalProperties?: boolean | UncheckedJSONSchemaType<unknown, false> | undefined; unevaluatedProperties?: boolean | UncheckedJSONSchemaType<unknown, false> | undefined; ... 7 more ...; maxProperties?: number | undefined; } & { ...; } & { ...; } & { ...; }'.
//     Type '{ readonly type: "object"; readonly properties: { readonly name: { readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }; }; readonly required: readonly [...]; readonly additionalProperties: false; }' is not assignable to type '{ type: "object"; additionalProperties?: boolean | UncheckedJSONSchemaType<unknown, false> | undefined; unevaluatedProperties?: boolean | UncheckedJSONSchemaType<unknown, false> | undefined; ... 7 more ...; maxProperties?: number | undefined; }'.
//       The types of 'properties.name' are incompatible between these types.
//         Type '{ readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }' is not assignable to type '{ $ref: string; } | (UncheckedJSONSchemaType<any, false> & { nullable: true; const?: null | undefined; enum?: readonly any[] | undefined; default?: any; })'.
//           Type '{ readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }' is not assignable to type '{ type: "object"; additionalProperties?: boolean | UncheckedJSONSchemaType<any, false> | undefined; unevaluatedProperties?: boolean | UncheckedJSONSchemaType<any, false> | undefined; ... 7 more ...; maxProperties?: number | undefined; } & { ...; } & { ...; } & { ...; } & { ...; }'.
//             Type '{ readonly type: "string"; readonly minLength: 1; readonly errorMessage: { readonly minLength: "username field is required"; }; }' is not assignable to type '{ type: "object"; additionalProperties?: boolean | UncheckedJSONSchemaType<any, false> | undefined; unevaluatedProperties?: boolean | UncheckedJSONSchemaType<any, false> | undefined; ... 7 more ...; maxProperties?: number | undefined; }'.
//               Types of property 'type' are incompatible.
//                 Type '"string"' is not assignable to type '"object"'.
// 関数自体が型引数を取るのでそれを与えて上げればいけそう？ `type Charactor = { name: string; }`みたいな感じで
// `type CharactorJson = FromSchema<typeof charactorSchema>;`でいけるのでは？
// https://github.com/react-hook-form/resolvers/blob/master/ajv/src/types.ts
// https://github.com/ajv-validator/ajv/blob/490eb8c0eba8392d071fef005e16d330f259d0ba/docs/api.md?plain=1#L32

// const Index: FC = () => {
//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isSubmitting },
//   } = useForm();
//   // } = useForm({ resolver: ajvResolver(charactorSchema) });
// 
//   const onSubmit = (values: any) => new Promise(resolve => {
//       setTimeout(() => {
//         alert(JSON.stringify(values, null, 2));
//         resolve('ok');
//       }, 3000);
//     });
// 
//   return (
//     <Box p={4}>
//       <p>This is the party page</p>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <FormControl isInvalid={!!errors.name}>
//           <FormLabel htmlFor="name">First name</FormLabel>
//           <Input id="name" placeholder="name" {...register('name')} />
//           <FormErrorMessage>{!!errors.name && errors.name.message}</FormErrorMessage>
//         </FormControl>
//         <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
//           Submit
//         </Button>
//       </form>
//     </Box>
//   );
// };

const Index: FC = () => (<div>party!</div>)

export default Index;
