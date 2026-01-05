#! /usr/bin/env node
const ParsedArgs = require('./lib/ParsedArgs')
const MrCommand = require('./lib/MrCommand')
const RunCommand = require('./lib/RunCommand')
const NodeVersion = require('./lib/NodeVersion')
const pkg = require('./package.json')

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

const nodeVersion = new NodeVersion(pkg.engines, process.versions.node)
if (!nodeVersion.isValid()) {
	console.error(nodeVersion.toError())
	process.exit(1)
}

// eslint-disable-next-line no-floating-promise/no-floating-promise
; (async () => {

	if (global.FUZZ) {
		return
	}

	try {
		await main (process.argv.slice (2))
	} catch (x) {
		const msg = x.toString().trim()
		if (msg) {
			console.error(msg)
		}
		process.exit(1)
	}

})()
