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
  field: Field,
} | {
  datetime: Date,
  wt: number,
  homeStatus: Party,
  visitorStatus: Party,
  field: Field,
}

export type Battle = {
  datetime: Date,
  home: Party,
  visitor: Party,
  turns: Turn[],
}

type UpdateCharactor = (receivers: Charactor[]) => (charactor: Charactor) => Charactor;
const updateCharactor: UpdateCharactor = receivers => charactor => {
  const receiver = resultReceivers.find(receiver => charactor.name === receiver.name);
  if (receiver) {
    return receiver;
  }
  return charactor;
}

export type Act = (battle: Battle, actor: Charactor, skill: Skill, receivers: Charactor[], datetime: Date, randoms: Randoms) => Turn
export type act: Act = (battle, actor, skill, receivers, datetime, randoms) => {
  const lastTurn = battle.turns.slice(-1)[0];
  const newTurn = {
    datetime,
    actor,
    skill,
    receivers,
    homeParty: lastTurn.homeParty,
    visitorParty: lastTurn.visitorParty,
    field: lastTurn.field,
  };

  if (skill.receiverCount === 0) {
    newTurn.field = skill.action(skill)(actor)(randoms)(turn.field);
  } else {
    const resultReceivers = receivers.map(receiver => skill.action(skill)(actor)(randoms)(turn.field)(receiver));
    newTurn.homeParty = newTurn.homeParty.charactors.map(updateCharactor(resultReceivers));
    newTurn.visitorParty = newTurn.visitorParty.charactors.map(updateCharactor(resultReceivers));
  }
  return newTurn;
};

type WaitCharactor = (charactor: Charactor, wt: number, randoms: Randoms) => Charactor;
const waitCharactor: WaitTurns = (charactor, wt, randoms) => {

  const abilities = getAbilities(charactor);
  const newCharactor = abilities.reduce((charactor, ability) => ability.wait(wt, charactor, randoms), { ...charactor });

  newCharactor.statuses = newCharactor.statuses
    .map(status => {
      status.restWt -= wt;
      return status;
    })
    .filter(status => status.restWt > 0);

  newCharactor.restWt = Math.max((newCharactor.restWt - wt), 0);
  return newCharactor;
};

//ターン経過による状態変化を起こす関数
//これの実装はabilityかあるいはstatusに持たせたほうがいいか。体力の回復とかステータス異常の回復とかなので
export type Wait = (battle: Battle, wt: number, datetime: Date, randoms: Randoms) => Turn
export type wait: Wait = (battle, wt, datetime, randoms) => {
  const lastTurn = battle.turns.slice(-1)[0];
  const newTurn = {
    datetime,
    wt,
    homeParty: lastTurn.homeParty,
    visitorParty: lastTurn.visitorParty,
    field: lastTurn.field,
  };
  newTurn.homeParty = newTurn.homeParty.charactors.map(charactor => waitCharactor(charactor, wt, randoms));
  newTurn.visitorParty = newTurn.visitorParty.charactors.map(charactor => waitCharactor(charactor, wt, randoms));

  return newTurn;
};

//TODO
//battleの終了条件の判定関数が必要なはず

//TODO
//いまはhomeParty visitorPartyという形で保持しているが、wt sortedな状態のほうがふさわしいかも
//そうなると、Charactor型に、homeかvisitorかの判別がつくpropertyがあると便利かも

//TODO 以下書く
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

