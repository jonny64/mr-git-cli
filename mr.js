#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')

; (async () => {
	try {
		const o = await new ParsedArgs (process.argv).value ()
		await (new MrCommand(o)).run ()
	} catch (x) {
		console.log (x)
		return '' + x
	}
})()
