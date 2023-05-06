import { prompt } from 'enquirer';
import type { Choice } from 'enquirer';

export type SelectOption = {
  value: string,
  label: string,
};

export type SelectTitle = {
  value: string,
  name: string,
  message: string,
};

export type DialogResult = {
  value: string;
}

type ChangeToChoice = (option: SelectOption) => Choice;
const changeToChoice: ChangeToChoice = option => ({ value: option.value, name: option.label });

// type IncludeString = (text: string, test: string) => boolean;
// const includeString: IncludeString = (text, test) => text.toLowerCase().includes(test.toLowerCase());
// 
// //AutocompleteMultiselectPrompt::updateFilteredOptionsと同じ実装
// //@see https://github.com/terkelg/prompts/blob/master/lib/elements/autocompleteMultiselect.js
// type Suggest = (input: string, values: SelectTitle[]) => SelectTitle[];
// const suggest: Suggest = (input, values) => values.filter(v => {
//   if (!input) {
//     return true;
//   }
//   if (includeString(v.title, input)) {
//     return true;
//   }
//   if (includeString(v.value, input)) {
//     return true;
//   }
//   return false;
// });

//export type TextInput = (message: string) => Promise<string>
export type TextInput = (message: string) => Promise<object>
export const textInput: TextInput = async message => {
  const response = await prompt({
    type: 'input',
    name: 'value',
    message: message
  });
  //return response.value;
  return response;
};

//export type Confirm = (message: string) => Promise<boolean>
export type Confirm = (message: string) => Promise<object>
export const confirm: Confirm = async message => {
  const response = await prompt({
    type: 'confirm',
    name: 'value',
    message: message
  });
  //return response.value;
  return response;
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
//export type MultiSelect = (message: string, limit: number, options: SelectOption[]) => Promise<string[]>
export type MultiSelect = (message: string, limit: number, options: SelectOption[]) => Promise<object>
export const multiSelect: MultiSelect = async (message, limit, options) => {
  try {
  const response: DialogResult = await prompt({
    type: options.length > 10 ? 'autocomplete' : 'select',
    name: 'value',
    message: message,
    choices: options.map(changeToChoice),
    multiple: true,
    limit: 10, //選択できる数ではなく表示数
    validate: () => true, //TODO 選択数の限定をここで行う
  });
  console.log(response.value);
  //return response.value;
  return response;
  } catch (err) {
  console.log(err === '');
  console.log('something error', err);
  throw err;
  }
};

////10以上の選択肢の場合は、自動的にautocmpleteに変わる形でいい。default10までが1ページなので
//export type Select = (message: string, options: SelectOption[]) => Promise<string>
//export const select: Select = async (message, options) => {
//  const response = await prompt({
//    type: options.length > 10 ? 'autocomplete' : 'select',
//    name: 'value',
//    message: message,
//    choices: options.map(changeToChoice),
//    limit: 10,
//  });
//  return response.value;
//};

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
    console.log(r);
  } catch (e) {
    console.log(e);
  }
};


test();

