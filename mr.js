#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const RunCommand = require('./lib/RunCommand')

// eslint-disable-next-line no-floating-promise/no-floating-promise
; (async () => {
	try {
		// @todo #0:1h add help --version with usage examples
		await new RunCommand (
			await MrCommand.withParsedArgs(
				new ParsedArgs (
					process.argv.slice (2)
				)
			).todo ()
		).run ()
	} catch (x) {
		console.log (new Error (x).message)
		return '' + x
	}
})()
