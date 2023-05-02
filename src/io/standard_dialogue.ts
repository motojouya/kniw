
import prompts from 'prompts';

export type SelectOption = {
  value: string,
  lavel: string,
};

export const multiSelect: Select = async (message, options) => {
};

export type Select = (message: string, options: SelectOption[]) => Promise<string>
export const select: Select = async (message, options) => {
  const response = await prompts({
    type: 'text',
    name: 'meaning',
    message: 'What is the meaning of life?'
  });

  console.log(response.meaning);
};


