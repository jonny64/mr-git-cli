#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const GitRepo = require('./lib/GitRepo')
const RunCommand = require('./lib/RunCommand')
const Push  = require('./lib/PushCommand')
const Switch  = require('./lib/SwitchCommand')
const Merge  = require('./lib/MergeCommand')

// eslint-disable-next-line no-floating-promise/no-floating-promise
; (async () => {
	try {
		const gitRepo = new GitRepo ()
		const parsedArgs = new ParsedArgs (
			process.argv.slice (2)
		)
		const commands = {
			Push,
			Switch,
			Create: Switch,
			Merge,
		}
		await new RunCommand (
			await new MrCommand({parsedArgs, gitRepo, commands}).todo ()
		).run ()
	} catch (x) {
		console.log (new Error (x).message)
		return '' + x
	}
})()
