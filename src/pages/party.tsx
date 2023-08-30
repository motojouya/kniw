import type { FC } from 'react';
import type { Party } from 'src/domain/party';
import type { Repository } from 'src/io/repository';
import type { Store } from 'src/store/store';

import { CharactorCard } from 'src/components/charactor';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ajvResolver } from '@hookform/resolvers/ajv';
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

import { NotWearableErorr } from 'src/domain/acquirement';
import { createCharactor } from 'src/domain/charactor';
import { createStore } from 'src/store/party';
import { createRepository } from 'src/io/indexed_db_repository';

import Link from 'next/link'

type PartyStore = Store<Party, NotWearableErorr | DataNotFoundError | CharactorDuplicationError | JsonSchemaUnmatchError>;

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
      {!party && (<Button type="button" onClick={() => console.log('import useState -> setPartyForm -> defaultValueへのeffecみたいな感じにしないといけない。関数を定義する')} >Import</Button>)}
      {party && (<Button type="button" onClick={() => console.log('export createCopy(name)みたいな感じで呼び出すだけ')} >Export</Button>)}
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

