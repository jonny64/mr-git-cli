#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const GitRepo = require('./lib/GitRepo')
const RunCommand = require('./lib/RunCommand')

; (async () => {
	try {
		await new RunCommand (
			await new MrCommand(
				new ParsedArgs (
					process.argv.slice (2)
				),
				new GitRepo ()
			).todo ()
		).run ()
	} catch (x) {
		console.log (x)
		return '' + x
	}
})()
