import Compiler from './src/compiler'
import { read, print } from './src/io'
const highlight = require('cli-highlight').highlight
const getHistory = require('./src/history');

async function repl(cp: Compiler,code: string): Promise<void> {
  const res = await cp.processInput(code)
  print(res.output, false)
  const output = await cp.execute()
  print(output, false)
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>>= ',
});

rl._writeToOutput = (str: string) => {
  rl.output.write(highlight(str,{language: 'cpp', ignoreIllegals: true}));
}

rl.prompt();

async function runRepl(cp: Compiler) {
  const history = await getHistory();
  rl.history = history.history;
  for await (const line of rl) {
    await repl(cp,line);
    rl.prompt();
    history.writeHistory(rl.history);
  }
}

export default runRepl
