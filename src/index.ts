import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import inquirer from 'inquirer';
import figlet from 'figlet';
// #!/usr/bin/env node

const test = () => console.log('test');

//yargs(hideBin(process.argv))
//  .command('serve [port]', 'start the server', (yargs) => {
//    return yargs
//      .positional('port', {
//        describe: 'port to bind on',
//        default: 5000
//      })
//  }, (argv) => {
//    if (argv.verbose) console.info(`start server on :${argv.port}`)
//    console.log(argv.port)
//  })
//  .option('verbose', {
//    alias: 'v',
//    type: 'boolean',
//    description: 'Run with verbose logging'
//  })
//  .parse()
//
//inquirer
//  .prompt([
//    /* Pass your questions in here */
//  ])
//  .then((answers) => {
//    // Use user feedback for... whatever!!
//  })
//  .catch((error) => {
//    if (error.isTtyError) {
//      // Prompt couldn't be rendered in the current environment
//    } else {
//      // Something else went wrong
//    }
//  });

// 実際のフォントを読んで参考にするらしく、フォントのファイルが無いとできないっぽい

//figlet.text('KNIW', function(err: any, data: any) {
//    if (err) {
//        console.log('Something went wrong...');
//        console.dir(err);
//        return;
//    }
//    console.log(data)
//});

// const num : number = +process.argv[2];
// console.log(fizzbuzz(num));
// 
// function fizzbuzz(num : number) : string {
//   if (num % 15 == 0) {
//     return "FizBuz";
//   } else if (num % 3 == 0) {
//     return "Fiz";
//   } else if (num % 5 == 0) {
//     return "Buz";
//   }
//   return num.toString();
// }
