import { Party } from 'src/model/party'
import { Charactor } from 'src/model/charactor'
import { Skill } from 'src/model/skill'
import {
  CreateSave<T>
  CreateGet<T>
  CreateRemove
  CreateList
  CreateStore<T>
} from 'src/mode/store';

const NAMESPACE = 'battle';

export type Turn = {
  datetime: Date,
  actor: Charactor,
  skill: Skill,
  receivers: Charactor[],
  homeStatus: Party,
  visitorStatus: Party,
}

export type Battle = {
  datetime: Date,
  home: Party,
  visitor: Party,
  turns: Turn[],
}

export type CreateParty = (name: string, charactors: Charactor[]) => Party
export const createParty: CreateParty = (name, charactors) => ({
  name,
  charactors,
})

export type Act = 

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

//同様にBattleLog型も
//BattleLogはモジュールとしてbattle関数を定義してもいいかもしれない。ちょくちょく対話したりコンソールにメッセージ出したりするので、そこをどう扱うかな

