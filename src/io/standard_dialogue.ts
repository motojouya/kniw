import { prompt } from 'enquirer';
//import type { Choice } from 'enquirer';
//import type { ArrayPromptOptions } from 'enquirer';

export type SelectOption = {
  value: string,
  label: string,
};

export type SelectTitle = {
  value: string,
  name: string,
  message: string,
};

//type ChangeToChoice = (option: SelectOption) => Choice;
type ChangeToChoice = (option: SelectOption) => { value: string, name: string, message: string };
const changeToChoice: ChangeToChoice = option => ({ value: option.value, name: option.label, message: (option.label + '_' + option.value) });

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

export type TextInput = (message: string) => Promise<string>
export const textInput: TextInput = async message => {
  const response = await prompt({
    type: 'input',
    name: 'value',
    message: message
  });
  return response.value;
};

export type Confirm = (message: string) => Promise<boolean>
export const confirm: Confirm = async message => {
  const response = await prompt({
    type: 'confirm',
    name: 'value',
    message: message
  });
  return response.value;
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
  try {
  const response = await prompt({
    type: options.length > 10 ? 'autocomplete' : 'select',
    name: 'value',
    message: message,
    //choices: options.map(changeToChoice),
    choices: [{name:'name-a', value:'value-a', message:'msg-a'}, {name:'name-b', value:'value-b', message:'msg-b'}]
    multiple: true,
    limit: limit,
  });
  console.log(response);
  return response.value;
  } catch (e) {
  console.log(e);
  throw e;
  }
};

//10以上の選択肢の場合は、自動的にautocmpleteに変わる形でいい。default10までが1ページなので
//export type Select = (message: string, options: SelectOption[]) => Promise<string>
//export const select: Select = async (message, options) => {
//  const response = await prompt({
//    type: options.length > 10 ? 'autocomplete' : 'select',
//    name: 'value',
//    message: message,
//    choices: options.map(changeToChoice),
//  });
//  return response.value;
//};

const test = () => {
  console.log('test');
};


test();

