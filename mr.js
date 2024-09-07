#! /usr/bin/env node
const [_, __, src, dst] = process.argv

const MrCommand = require('./lib/MrCommand')

; (async () => {
	try {
		await (new MrCommand({src, dst})).run ()
	} catch (x) {
		console.log (x)
		return '' + x
	}
})()
