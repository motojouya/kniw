#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command('serve [port]', 'start the server', (yargs) => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv.port)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .parse()

// 実際のフォントを読んで参考にするらしく、フォントのファイルが無いとできないっぽい
// const figlet = require('figlet');
// 
// figlet.text('KNIW', { font: 'sans-serif' }, function(err: any, data: any) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data)
// });

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
