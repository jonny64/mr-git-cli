#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const GitRepo = require('./lib/GitRepo')
// @todo #0:30m move to lib/commands/Push, lib/commands/Switch, etc.
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
			// @todo #0:1h add help --version with usage examples
		}
		await new RunCommand (
			await new MrCommand({parsedArgs, gitRepo, commands}).todo ()
		).run ()
	} catch (x) {
		console.log (new Error (x).message)
		return '' + x
	}
})()
