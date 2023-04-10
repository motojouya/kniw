import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import prompts from 'prompts';

yargs(hideBin(process.argv))
  .command('curl <url>', 'fetch the contents of the URL', () => {}, (argv) => {
    console.info(argv)
  })
  .demandCommand(1)
  .parse()

// const prompts = require('prompts');

const response = prompts({
  type: 'text',
  name: 'meaning',
  message: 'What is the meaning of life?'
}).then(r => console.log(r.meaning));

//console.log(response.meaning);
