import { Physical, addPhysicals } from 'src/model/basics'
import { Weapon, Armor, Element } from 'src/model/equipment'
import { Ability } from 'src/model/ability'
import { Skill } from 'src/model/skill'

const basePhysical: Physical = {
  MaxHP: 100,
  MaxMP: 100,
  STR: 100,
  VIT: 100,
  DEX: 100,
  AGI: 100,
  AVD: 100,
  INT: 100,
  MND: 100,
  RES: 100,
  WT: 100,
};

export type Charactor = {
  name: string,
  weapon: Weapon,
  armor: Armor,
  element: Element,
  getAbilities: GetAbilities,
  getSkills: GetSkills,
  getPhysical: GetPhysical,
  statuses: Status[],
  hp: number,
  mp: number,
}

export type GetAbilities = (self: Charactor) => Ability[];
const getAbilities: GetAbilities = self => [...self.weapon.abilities, ...self.armor.abilities, ...self.element.abilities];

export type GetSkills = (self: Charactor) => Skill[];
const getSkills: GetSkills = self => [...self.weapon.skills, ...self.armor.skills, ...self.element.skills];

export type GetPhysical = (self: Charactor) => Physical;
const getPhysical: GetPhysical = self => addPhysicals([basePhysical, self.weapon.additionalPhysical, self.armor.additionalPhysical, self.element.additionalPhysical]);

//CharactorについてはDBへの保存関数も記載したい
//同様にBattleLog, Party型も
//BattleLogはモジュールとしてbattle関数を定義してもいいかもしれない。ちょくちょく対話したりコンソールにメッセージ出したりするので、そこをどう扱うかな
//Ability型を作って上げる必要がある

