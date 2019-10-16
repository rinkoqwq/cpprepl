#!/usr/bin/env node

import yargs from 'yargs';
import Compiler from './src/compiler'
import { read, print } from './src/io'

const argv = yargs.options({
  'clang++': {
    type: 'boolean',
  },
  'g++': {
    type: 'boolean',
  },
  'gcc': {
    type: 'boolean',
  },
  'clang': {
    type: 'boolean',
  }
}).argv

let compilerName = 'g++'

if (argv.gcc || argv.clang)
  compilerName = argv.gcc ? 'gcc' : 'clang'
if (argv["clang++"] || argv["g++"])
  compilerName = argv["g++"] ? 'g++' : 'clang++'

const cp = new Compiler(compilerName)

async function repl(): Promise<void> {
  const code: string = await read()
  const res = await cp.processInput(code)
  print(res.output, false)
  const output = await cp.execute()
  print(output, false)
}

async function runRepl() {
  while (1) {
    try {
      await repl()
    } catch (e) {
      console.error(e)
      process.exit(0)
    }
  }
}

runRepl()
