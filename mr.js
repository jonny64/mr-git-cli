#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const RunCommand = require('./lib/RunCommand')

const main = async (argv) => {
	await new RunCommand (
		await MrCommand.withParsedArgs(
			new ParsedArgs (
				argv
			)
		).todo ()
	).run ()
}

module.exports = {
	main
}

// eslint-disable-next-line no-floating-promise/no-floating-promise
; (async () => {

	if (global.FUZZ) {
		return
	}

	try {
		await main (process.argv.slice (2))
	} catch (x) {
		console.error(`Node.js version: ${process.version}`)
		console.error(x.message.split('\n')[0])
		process.exit(1)
	}

})()
