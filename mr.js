#! /usr/bin/env node
const [_, __, src, dst] = process.argv

const ShellCommand = require('./lib/ShellCommand')

; (new ShellCommand({ cmd: `git switch --create ${src}` })).run ()