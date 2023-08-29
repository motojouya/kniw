import type { FC } from 'react';
import type { Acquirement } from 'src/domain/acquirement';
import type { Charactor } from 'src/domain/charactor';
import type { Party } from 'src/domain/party';
import type { Repository } from 'src/io/repository';
import type { Store } from 'src/store/store';

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
  Table,
//  Thead,
  Tbody,
//  Tfoot,
  Tr,
  Th,
  Td,
//  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { useLiveQuery } from "dexie-react-hooks";

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
import { createStore } from 'src/store/party';
import { createRepository } from 'src/io/indexed_db_repository';

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

type PartyStore = Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

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
    <TableContainer>
      <Table variant='simple'>
        <Tbody>
          <Tr><Th>名前      </Th><Td>{charactor.name}          </Td></Tr>
          <Tr><Th>種族      </Th><Td>{charactor.race.label}    </Td></Tr>
          <Tr><Th>祝福      </Th><Td>{charactor.blessing.label}</Td></Tr>
          <Tr><Th>装備      </Th><Td>{charactor.clothing.label}</Td></Tr>
          <Tr><Th>武器      </Th><Td>{charactor.weapon.label}  </Td></Tr>
          <Tr><Th>MaxHP     </Th><Td>{physical.MaxHP}          </Td></Tr>
          <Tr><Th>MaxMP     </Th><Td>{physical.MaxMP}          </Td></Tr>
          <Tr><Th>STR       </Th><Td>{physical.STR}            </Td></Tr>
          <Tr><Th>VIT       </Th><Td>{physical.VIT}            </Td></Tr>
          <Tr><Th>DEX       </Th><Td>{physical.DEX}            </Td></Tr>
          <Tr><Th>AGI       </Th><Td>{physical.AGI}            </Td></Tr>
          <Tr><Th>AVD       </Th><Td>{physical.AVD}            </Td></Tr>
          <Tr><Th>INT       </Th><Td>{physical.INT}            </Td></Tr>
          <Tr><Th>MND       </Th><Td>{physical.MND}            </Td></Tr>
          <Tr><Th>RES       </Th><Td>{physical.RES}            </Td></Tr>
          <Tr><Th>WT        </Th><Td>{physical.WT}             </Td></Tr>
          <Tr><Th>刺突耐性  </Th><Td>{physical.StabResistance} </Td></Tr>
          <Tr><Th>斬撃耐性  </Th><Td>{physical.SlashResistance}</Td></Tr>
          <Tr><Th>打撃耐性  </Th><Td>{physical.BlowResistance} </Td></Tr>
          <Tr><Th>火属性    </Th><Td>{physical.FireSuitable}   </Td></Tr>
          <Tr><Th>岩属性    </Th><Td>{physical.RockSuitable}   </Td></Tr>
          <Tr><Th>水属性    </Th><Td>{physical.WaterSuitable}  </Td></Tr>
          <Tr><Th>氷属性    </Th><Td>{physical.IceSuitable}    </Td></Tr>
          <Tr><Th>風属性    </Th><Td>{physical.AirSuitable}    </Td></Tr>
          <Tr><Th>雷属性    </Th><Td>{physical.ThunderSuitable}</Td></Tr>
          <Tr><Th>移動距離  </Th><Td>{physical.move}           </Td></Tr>
          <Tr><Th>移動高さ  </Th><Td>{physical.jump}           </Td></Tr>
          <Tr><Th>アビリティ</Th><Td>{abilitiesText}           </Td></Tr>
          <Tr><Th>スキル    </Th><Td>{skillsText}              </Td></Tr>
        </Tbody>
      </Table>
    </TableContainer>
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
    <Card p={3} border='solid'>
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

type SaveParty = (values: any) => Promise<void>
const saveParty: SaveParty = async values => {



  const charactorNames = await store.list();
  if (charactorNames.includes(name)) {
    await notice(`${name}は既に雇っています`);
  }

  const raceOptions: SelectOption[] = allRaces.map(race => ({ value: race.name, label: race.label }));
  const raceName = await select('種族を選んでください', raceOptions);
  if (!raceName || raceName instanceof NotApplicable) {
    return;
  }
  const race = getRace(raceName);
  if (!race) {
    await notice(`${raceName}という種族は存在しません`);
    return;
  }

  const blessingOptions: SelectOption[] = allBlessings.map(blessing => ({
    value: blessing.name,
    label: blessing.label,
  }));
  const blessingName = await select('種族を選んでください', blessingOptions);
  if (!blessingName || blessingName instanceof NotApplicable) {
    return;
  }
  const blessing = getBlessing(blessingName);
  if (!blessing) {
    await notice(`${blessingName}という祝福は存在しません`);
    return;
  }

  const clothingOptions: SelectOption[] = allClothings.map(clothing => ({
    value: clothing.name,
    label: clothing.label,
  }));
  const clothingName = await select('種族を選んでください', clothingOptions);
  if (!clothingName || clothingName instanceof NotApplicable) {
    return;
  }
  const clothing = getClothing(clothingName);
  if (!clothing) {
    await notice(`${clothingName}という装備は存在しません`);
    return;
  }

  const weaponOptions: SelectOption[] = allWeapons.map(weapon => ({ value: weapon.name, label: weapon.label }));
  const weaponName = await select('種族を選んでください', weaponOptions);
  if (!weaponName || weaponName instanceof NotApplicable) {
    return;
  }
  const weapon = getWeapon(weaponName);
  if (!weapon) {
    await notice(`${weaponName}という種族は存在しません`);
    return;
  }

  const charactor = createCharactor(name, race, blessing, clothing, weapon);

  if (charactor instanceof NotWearableErorr) {
    await notice(charactor.message);
    return;
  }

  await store.save(charactor);
  await notice(`${name}を雇いました`);

  store.save();


  try {
    // Add the new friend!
    const id = await db.friends.add({
      name,
      age
    });

    setStatus(`Friend ${name} successfully added. Got id ${id}`);
    setName("");
    setAge(defaultAge);
  } catch (error) {
    setStatus(`Failed to add ${name}: ${error}`);
  }
}

const PartyEditor: FC<{ party: Party | null, store: PartyStore }> = ({ party, store }) => {
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

  const { fields, append, remove } = useFieldArray({ control, name: "charactors" });

  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <Box p={4}>
      <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
      <Text>This is the party page</Text>
      {!party && (<Button type="button" onClick={() => console.log('import')} >Import</Button>)}
      {party && (<Button type="button" onClick={() => console.log('export')} >Export</Button>)}
      <form onSubmit={handleSubmit((values: any) => saveParty(values))}>
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
        <Button colorScheme="teal" isLoading={isSubmitting} type="submit">{party ? 'Change' : 'Create'}</Button>
        <Button type="button" onClick={() => console.log('dismiss')} >Dismiss</Button>
      </form>
    </Box>
  );
  /* eslint-enable @typescript-eslint/no-misused-promises */
};

const NoParty: FC<{ name: string }> = ({ name }) => (
  <Box>
    <Text>{`${name}というpartyは見つかりません`}</Text>
    <Link href={{ pathname: 'party' }}><a>戻る</a></Link>
  </Box>
);

const PartyContainer: FC<{ name: string, store: PartyStore }> = ({ name, store }) => {

  const party = useLiveQuery(() => store.get(name), [name]);

  if (name === '_new') {
    return <PartyEditor party={null} store={store} />
  }

  if (name === 'team01') {
    return <PartyEditor party={party} store={store} />
  }

  return (<NoParty name={name} />);
}:

const PartyList: FC<{ store: PartyStore }> = ({ store }) => {
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

const testParty = (toParty({ name: 'team01', charactors: [
  { name: 'sam', race: 'human', blessing: 'earth', clothing: 'steelArmor', weapon: 'swordAndShield', statuses: [], hp: 100, mp: 0, restWt: 120 },
  { name: 'john', race: 'human', blessing: 'earth', clothing: 'redRobe', weapon: 'rubyRod', statuses: [], hp: 100, mp: 0, restWt: 115 },
]}) as Party);

const Index: FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [store, setStore] = useState<PartyStore | null>(null);

  useEffect(async () => {
    const webRepository = await createRepository();
    const store = await createStore(repository);
    setStore(store);
  }, []);

  if (!store) {
    return (<Box><Text>loading...</Text></Box>);
  }

  if (!name) {
    return (<PartyList store={store} />);
  }

  return <PartyContainer name={name} store={store}>
};

export default Index;

