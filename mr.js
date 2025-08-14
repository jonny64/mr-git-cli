#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const RunCommand = require('./lib/RunCommand')

const main = async (argv) => {
	// @todo #0:1h check minimal node version and exit if too old
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
		return '' + x
	}

})()
