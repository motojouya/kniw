import prompts from 'prompts';
import type { Choice, Answers } from 'prompts';

export type SelectOption = {
  value: string,
  label: string,
};

export type NotApplicable = {
  message: string,
};

export function isNotApplicable(obj: any): obj is NotApplicable {
  return "message" in obj;
}

type ChangeToChoice = (option: SelectOption) => Choice;
const changeToChoice: ChangeToChoice = option => ({ value: option.value, title: option.label });

export type TextInput = (message: string) => Promise<string | NotApplicable>
export const textInput: TextInput = async message => {
  const response: Answers<"value"> = await prompts({
    type: 'text',
    name: 'value',
    message: message
  });

  if ('value' in response) {
    return (response.value as string);
  } else {
    return { message: "回答がありません" };
  }
};

export type Confirm = (message: string) => Promise<boolean | NotApplicable>
export const confirm: Confirm = async message => {
  const response: Answers<"value"> = await prompts({
    type: 'confirm',
    name: 'value',
    message: message
  });

  if ('value' in response) {
    return (response.value as boolean);
  } else {
    return { message: "回答がありません" };
  }
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
export type MultiSelect = (message: string, limit: number, options: SelectOption[]) => Promise<string[] | NotApplicable>
export const multiSelect: MultiSelect = async (message, limit, options) => {
  const response: Answers<"value"> = await prompts({
    type: options.length > 10 ? 'autocompleteMultiselect' : 'multiselect',
    name: 'value',
    message: message,
    choices: options.map(changeToChoice),
    max: limit,
  });

  if ('value' in response) {
    return (response.value as string[]);
  } else {
    return { message: "回答がありません" };
  }
};

export type Select = (message: string, options: SelectOption[]) => Promise<string | NotApplicable>
export const select: Select = async (message, options) => {
  const response = await multiSelect(message, 1, options);
  if (isNotApplicable(response)) {
    return response
  } else {
    if (response.length > 0) {
      return response[0];
    } else {
      return { message: "回答がありません" };
    }
  }
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

