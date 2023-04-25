import { Charactor, getPhysical } from 'src/model/charactor'
import {
  CreateSave<T>
  CreateGet<T>
  CreateRemove
  CreateList
  CreateStore<T>
} from 'src/mode/store';

const NAMESPACE = 'party';

export type Party = {
  name: string,
  charactors: Charactor[],
}

export type CreateParty = (name: string, charactors: Charactor[]) => Party
export const createParty: CreateParty = (name, charactors) => ({
  name,
  charactors,
})

export type sortByWT = (home: Party, visitor: Party) => Charactor[]
export type sortByWT = (home, visitor) => [...home.charactors, ...visitor.charactors].sort((left, right) => (left.restWt - right.restWt))

const createSave: CreateSave<Party> =
  storage =>
  async obj =>
  (await storage.save(NAMESPACE, obj.name, obj));

const createGet: CreateGet<Party> =
  storage =>
  async name =>
  createParty(...(await storage.get(NAMESPACE, name)));

const createRemove: CreateRemove =
  storage =>
  async name =>
  (await storage.remove(NAMESPACE, name));

const createList: CreateList =
  storage =>
  async () =>
  (await storage.list(NAMESPACE));

export const createStorage: CreateStore<Charactor> = storage => {
  storage.checkNamespace(NAMESPACE);
  return {
    save: createSave(storage),
    list: createList(storage),
    get: createGet(storage),
    remove: createRemove(storage),
  }
};

