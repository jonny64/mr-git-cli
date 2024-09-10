#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')

; (async () => {
	try {
		await (new MrCommand(
			new ParsedArgs (
				process.argv.slice (2)
			)
		)).run ()
	} catch (x) {
		console.log (x)
		return '' + x
	}
})()
