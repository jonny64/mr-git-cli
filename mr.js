#! /usr/bin/env node
const [_, __, src, dst] = process.argv

const MrCommand = require('./lib/MrCommand')

; (new MrCommand({src, dst})).run ()
