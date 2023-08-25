import type { FC } from 'react';
import type { Acquirement } from 'src/domain/acquirement';
import type { Charactor } from 'src/domain/charactor';
import type { Party } from 'src/domain/party';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { JSONSchemaType } from "ajv"
import { ajvResolver } from '@hookform/resolvers/ajv';
import {
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  Merge,
  FieldErrorsImpl,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormGetValues,
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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
  Heading,
  Text,
} from '@chakra-ui/react';

import { NotWearableErorr } from 'src/domain/acquirement';
import {
  getRace,
  getBlessing,
  getClothing,
  getWeapon,
  allRaces,
  allWeapons,
  allClothings,
  allBlessings,
} from 'src/store/acquirement';
import {
  createCharactor,
  getPhysical,
  getAbilities,
  getSkills,
} from 'src/domain/charactor';
import { toParty } from 'src/domain/party';

import Link from 'next/link'

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
    <FormLabel htmlFor={keyPrefix}>{name}</FormLabel>
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

const CharactorDetail: FC<{ charactor: Charactor }> = ({ charactor }) => {
  const physical = getPhysical(charactor);

  const abilities = getAbilities(charactor);
  const abilitiesText = abilities.map(ability => ability.label).join(', ');

  const skills = getSkills(charactor);
  const skillsText = skills.map(skill => skill.label).join(', ');

  return (
    <Box as={'dl'}>
      <Heading as={'dt'}>名前</Heading><Text as={'dd'}>{charactor.name}</Text>
      <Heading as={'dt'}>種族</Heading><Text as={'dd'}>{charactor.race.label}</Text>
      <Heading as={'dt'}>祝福</Heading><Text as={'dd'}>{charactor.blessing.label}</Text>
      <Heading as={'dt'}>装備</Heading><Text as={'dd'}>{charactor.clothing.label}</Text>
      <Heading as={'dt'}>武器</Heading><Text as={'dd'}>{charactor.weapon.label}</Text>
      <Heading as={'dt'}>MaxHP</Heading><Text as={'dd'}>{physical.MaxHP}</Text>
      <Heading as={'dt'}>MaxMP</Heading><Text as={'dd'}>{physical.MaxMP}</Text>
      <Heading as={'dt'}>STR</Heading><Text as={'dd'}>{physical.STR}</Text>
      <Heading as={'dt'}>VIT</Heading><Text as={'dd'}>{physical.VIT}</Text>
      <Heading as={'dt'}>DEX</Heading><Text as={'dd'}>{physical.DEX}</Text>
      <Heading as={'dt'}>AGI</Heading><Text as={'dd'}>{physical.AGI}</Text>
      <Heading as={'dt'}>AVD</Heading><Text as={'dd'}>{physical.AVD}</Text>
      <Heading as={'dt'}>INT</Heading><Text as={'dd'}>{physical.INT}</Text>
      <Heading as={'dt'}>MND</Heading><Text as={'dd'}>{physical.MND}</Text>
      <Heading as={'dt'}>RES</Heading><Text as={'dd'}>{physical.RES}</Text>
      <Heading as={'dt'}>WT</Heading><Text as={'dd'}>{physical.WT}</Text>
      <Heading as={'dt'}>刺突耐性</Heading><Text as={'dd'}>{physical.StabResistance}</Text>
      <Heading as={'dt'}>斬撃耐性</Heading><Text as={'dd'}>{physical.SlashResistance}</Text>
      <Heading as={'dt'}>打撃耐性</Heading><Text as={'dd'}>{physical.BlowResistance}</Text>
      <Heading as={'dt'}>火属性</Heading><Text as={'dd'}>{physical.FireSuitable}</Text>
      <Heading as={'dt'}>岩属性</Heading><Text as={'dd'}>{physical.RockSuitable}</Text>
      <Heading as={'dt'}>水属性</Heading><Text as={'dd'}>{physical.WaterSuitable}</Text>
      <Heading as={'dt'}>氷属性</Heading><Text as={'dd'}>{physical.IceSuitable}</Text>
      <Heading as={'dt'}>風属性</Heading><Text as={'dd'}>{physical.AirSuitable}</Text>
      <Heading as={'dt'}>雷属性</Heading><Text as={'dd'}>{physical.ThunderSuitable}</Text>
      <Heading as={'dt'}>移動距離</Heading><Text as={'dd'}>{physical.move}</Text>
      <Heading as={'dt'}>移動高さ</Heading><Text as={'dd'}>{physical.jump}</Text>
      <Heading as={'dt'}>アビリティ</Heading><Text as={'dd'}>{abilitiesText}</Text>
      <Heading as={'dt'}>スキル</Heading><Text as={'dd'}>{skillsText}</Text>
    </Box>
  );
};

const CharactorCard: FC<{
  register: UseFormRegister<PartyForm>,
  getValues: UseFormGetValues<PartyForm>,
  remove: (index?: number | number[]) => void,
  errors: FieldErrors<PartyForm>,
  index: number,
}> = ({ register, getValues, remove, errors, index, }) => {

  const nameError = getCharactorError(errors, index, 'name');
  const [charactor, setCharactor] = useState<Charactor | string>('入力してください');

  const onBlur = () => {
    const charactorForm = getValues(`charactors.${index}` as const);

    const charactorName = charactorForm.name;
    const race = getRace(charactorForm.race);
    const blessing = getBlessing(charactorForm.blessing);
    const clothing = getClothing(charactorForm.clothing);
    const weapon = getWeapon(charactorForm.weapon);

    if (!charactorName || !race || !blessing || !clothing || !weapon) {
      setCharactor('入力してください');
      return;
    }

    const charactorObj = createCharactor(charactorName, race, blessing, clothing, weapon);
    if (charactorObj instanceof NotWearableErorr) {
      setCharactor('選択できない組み合わせです');
      return;
    }

    setCharactor(charactorObj);
  };

  return (
    <Card>
      <CardHeader>
        <Button type="button" onClick={() => remove(index)}>Fire</Button>
      </CardHeader>
      <CardBody>
        <FormControl isInvalid={!!nameError}>
          <FormLabel htmlFor={`charactors.${index}.name`}>name</FormLabel>
          <Input {...register(`charactors.${index}.name` as const, { onBlur })} placeholder="name" />
          <FormErrorMessage>{!!nameError && nameError.message}</FormErrorMessage>
        </FormControl>
        <SelectAcquirement
          name={'race'}
          keyPrefix={`charactors.${index}.race`}
          allAcquirements={allRaces}
          error={getCharactorError(errors, index, 'race')}
          selectProps={register(`charactors.${index}.race` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'blessing'}
          keyPrefix={`charactors.${index}.blessing`}
          allAcquirements={allBlessings}
          error={getCharactorError(errors, index, 'blessing')}
          selectProps={register(`charactors.${index}.blessing` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'clothing'}
          keyPrefix={`charactors.${index}.clothing`}
          allAcquirements={allClothings}
          error={getCharactorError(errors, index, 'clothing')}
          selectProps={register(`charactors.${index}.clothing` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'weapon'}
          keyPrefix={`charactors.${index}.weapon`}
          allAcquirements={allWeapons}
          error={getCharactorError(errors, index, 'weapon')}
          selectProps={register(`charactors.${index}.weapon` as const, { onBlur })}
        />
      </CardBody>
      <CardFooter>
        {typeof charactor === 'string' ? <Text>{charactor}</Text> : <CharactorDetail charactor={charactor} />}
      </CardFooter>
    </Card>
  );
};

type ToPartyForm = (party: Party) => PartyForm;
const toPartyForm: ToPartyForm = party => ({
  name: party.name,
  charactors: party.charactors.map(charactor => ({
    name: charactor.name,
    race: charactor.race.name,
    blessing: charactor.blessing.name,
    clothing: charactor.clothing.name,
    weapon: charactor.weapon.name,
  }))
});

const Form: FC<{ party: Party | null }> = ({ party }) => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PartyForm>({
    resolver: ajvResolver<PartyForm>(partyFormSchema),
    defaultValues: party ? toPartyForm(party) : {
      name: '',
      charactors: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "charactors"
  });

  const onSubmit = (values: any) => new Promise(resolve => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    resolve('ok');
  });

  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <Box p={4}>
      <p>This is the party page</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {party ? (
          <Box as={'dl'}>
            <Heading as={'dt'}>party name</Heading>
            <Text as={'dd'}>{party.name}</Text>
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
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">{party ? 'Change' : 'Create'}</Button>
      </form>
    </Box>
  );
  /* eslint-enable @typescript-eslint/no-misused-promises */
};

const testParty = (toParty({ name: 'team01', charactors: [
  { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
  { name: 'sam', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
]}) as Party);

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  if (!name) {
    return (
      <Box>
        <Link href={{ pathname: 'party', query: { name: 'team01' } }}><a>{'team01'}</a></Link>
      </Box>
    );
  }

  if (name === '_new') {
    return <Form party={null} />
  }

  if (name === 'team01') {
    return <Form party={testParty}/>
  }

  return (
    <Box>
      <Text>{`${name}というpartyは見つかりません`}</Text>
      <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
    </Box>
  );
};

export default Index;

