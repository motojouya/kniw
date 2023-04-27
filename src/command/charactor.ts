#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
// const commander = require('../'); // include commander in git clone of commander repo
import commander from 'commander';
const program = new commander.Command();

const charactor = program.command('charactor');

charactor
  .command('hire')
  .argument('<name>', 'hiring charactor name')
  .description('hire charactor as you like')
  .action(name => console.log('You hire' + name + '!'));

charactor
  .command('status')
  .argument('<name>', 'charactor name you looking')
  .description('look charactor as you like')
  .action(name => console.log('This is' + name + '!'));

charactor
  .command('fire')
  .argument('<name>', 'firing charactor name')
  .description('fire charactor as you like')
  .action(name => console.log('You fire' + name));

program.parse(process.argv);

//export program;
