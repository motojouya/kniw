import prompts from 'prompts';
//import { PromptObject } from '@type/prompts';
import type { PromptObject } from 'prompts';

export type SelectOption = {
  value: string,
  label: string,
};

export type SelectTitle = {
  value: string,
  title: string,
};

type Change = (option: SelectOption) => SelectTitle;
const change: Change = option => ({ value: option.value, title: option.label });

type IncludeString = (text: string, test: string) => boolean;
const includeString: IncludeString = (text, test) => text.toLowerCase().includes(test.toLowerCase());

//AutocompleteMultiselectPrompt::updateFilteredOptionsと同じ実装
//@see https://github.com/terkelg/prompts/blob/master/lib/elements/autocompleteMultiselect.js
type Suggest = (input: string, values: SelectTitle[]) => SelectTitle[];
const suggest: Suggest = (input, values) => values.filter(v => {
  if (!input) {
    return true;
  }
  if (includeString(v.title, input)) {
    return true;
  }
  if (includeString(v.value, input)) {
    return true;
  }
  return false;
});

export type TextInput = (message: string) => Promise<string>
export const textInput: TextInput = async message => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: message
  });
  return response.value;
};

export type Confirm = (message: string) => Promise<boolean>
export const confirm: Confirm = async message => {
  const response = await prompts({
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
  let request: PromptObject<string> | null = null;
  if (options.length > 10) {
    request = {
      type: 'autocompleteMultiselect',
      name: 'value',
      message: message,
      choices: options.map(change),
      max: limit,
      suggest: suggest,
    };
  } else {
    request = {
      type: 'multiselect',
      name: 'value',
      message: message,
      choices: options.map(change),
      max: limit,
    };
  }

  const response = await prompts(request);
  return response.value;
};

//10以上の選択肢の場合は、自動的にautocmpleteに変わる形でいい。default10までが1ページなので
export type Select = (message: string, options: SelectOption[]) => Promise<string>
export const select: Select = async (message, options) => {
  let request: PromptObject<string> | null = null;
  if (options.length > 10) {
    request = {
      type: 'autocomplete',
      name: 'value',
      message: message,
      choices: options.map(change),
      suggest: suggest,
    };
  } else {
    request = {
      type: 'select',
      name: 'value',
      message: message,
      choices: options.map(change),
    };
  }

  const response = await prompts(request);
  return response.value;
};

const test = () => {
  console.log('test');
};


test();

