import prompts from 'prompts';
import type { Choice, Answers } from 'prompts';

export type SelectOption = {
  value: string;
  label: string;
};

export class NotApplicable {
  constructor(readonly message: string) {}
}

type ChangeToChoice = (option: SelectOption) => Choice;
const changeToChoice: ChangeToChoice = option => ({ value: option.value, title: option.label });

export type TextInput = (message: string) => Promise<string | NotApplicable>;
export const textInput: TextInput = async message => {
  const response: Answers<'value'> = await prompts({
    type: 'text',
    name: 'value',
    message,
  });

  if ('value' in response) {
    return response.value as string;
  } else {
    return new NotApplicable('回答がありません');
  }
};

export type Confirm = (message: string) => Promise<boolean | NotApplicable>;
export const confirm: Confirm = async message => {
  const response: Answers<'value'> = await prompts({
    type: 'confirm',
    name: 'value',
    message,
  });

  if ('value' in response) {
    return response.value as boolean;
  } else {
    return new NotApplicable('回答がありません');
  }
};

export type Notice = (message: string) => Promise<void>;
 
export const notice: Notice = async message => {
  console.log(message);
};

export type Clear = () => Promise<void>;
 
export const clear: Clear = async () => {
  console.clear();
};

// 10以上の選択肢の場合は、自動的にautocmpleteに変わる形でいい。default10までが1ページなので
export type MultiSelect = (
  message: string,
  limit: number,
  options: SelectOption[],
) => Promise<string[] | NotApplicable>;
export const multiSelect: MultiSelect = async (message, limit, options) => {
  const response: Answers<'value'> = await prompts({
    type: options.length > 10 ? 'autocompleteMultiselect' : 'multiselect',
    name: 'value',
    message,
    choices: options.map(changeToChoice),
    max: limit,
  });

  if ('value' in response) {
    return response.value as string[];
  } else {
    return new NotApplicable('回答がありません');
  }
};

export type Select = (message: string, options: SelectOption[]) => Promise<string | NotApplicable>;
export const select: Select = async (message, options) => {
  const response = await multiSelect(message, 1, options);
  if (response instanceof NotApplicable) {
    return response;
  } else {
    if (response.length > 0) {
      return response[0];
    } else {
      return new NotApplicable('回答がありません');
    }
  }
};

export type Dialogue = {
  textInput: TextInput;
  confirm: Confirm;
  notice: Notice;
  clear: Clear;
  multiSelect: MultiSelect;
  select: Select;
};
export const dialogue: Dialogue = {
  textInput,
  confirm,
  notice,
  clear,
  multiSelect,
  select,
};
