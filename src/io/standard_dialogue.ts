import prompts from 'prompts';
import type { Choice } from 'prompts';

export type SelectOption = {
  value: string,
  label: string,
};

export type DialogResult = {
  value: boolean | string | string[];
}

type ChangeToChoice = (option: SelectOption) => Choice;
const changeToChoice: ChangeToChoice = option => ({ value: option.value, title: option.label });

export type TextInput = (message: string) => Promise<string>
export const textInput: TextInput = async message => {
  const response: DialogResult = await prompts({
    type: 'text',
    name: 'value',
    message: message
  });
  return (response.value as string);
};

export type Confirm = (message: string) => Promise<boolean>
export const confirm: Confirm = async message => {
  const response: DialogResult = await prompts({
    type: 'confirm',
    name: 'value',
    message: message
  });
  return (response.value as boolean);
};

export type Message = (message: string) => Promise<void>
export const message: Message = async message => {
  console.log(message);
};

export type Clear = () => Promise<void>
export const clear: Clear = async () => {
  console.clear();
};

//10以上の選択肢の場合は、自動的にautocmpleteに変わる形でいい。default10までが1ページなので
export type MultiSelect = (message: string, limit: number, options: SelectOption[]) => Promise<string[]>
export const multiSelect: MultiSelect = async (message, limit, options) => {
  const response: DialogResult = await prompts({
    type: options.length > 10 ? 'autocompleteMultiselect' : 'multiselect',
    name: 'value',
    message: message,
    choices: options.map(changeToChoice),
    max: limit,
  });
  return (response.value as string[]);
};

export type Select = (message: string, options: SelectOption[]) => Promise<string>
export const select: Select = async (message, options) => {
  const response = await multiSelect(message, 1, options);
  return response[0];
};

//TODO escape keyで結果にvalue propertyがない状態になるので、それを検知して何かしらしたい。
//例外ではないよな。単に結果なしなので、そういうハンドリングができる型に変えちゃうか
const test = async () => {
  try {
    const r = await multiSelect('選んでください', 3, [
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
      { label: 'c', value: 'c' },
      { label: 'd', value: 'd' },
      { label: 'e', value: 'e' },
      { label: 'f', value: 'f' },
      { label: 'g', value: 'g' },
      { label: 'h', value: 'h' },
      { label: 'i', value: 'i' },
      { label: 'j', value: 'j' },
      { label: 'k', value: 'k' },
      { label: 'l', value: 'l' },
      { label: 'm', value: 'm' },
      { label: 'n', value: 'n' },
    ]);
    //const r = await textInput('なんでしょうか');
    //const r = await confirm('ほんまのほんまに？');
    console.log('try ok', r);
  } catch (e) {
    console.log('catch ng', e);
  }
};

test();

