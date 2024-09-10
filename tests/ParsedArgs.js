const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ParsedArgs = require ('../lib/ParsedArgs')


describe('ParsedArgs', () => {
	const toArgv = s => s.split (/\s+/)
	it ('2 args not valid', async (t) => {
		assert.throws(() => await (new ParsedArgs (toArgv (`TASK-42 from`)).value ()))
	})
	it ('push branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs ([]).value (), {dst: '', action: 'push', src: ''})
	})
	it ('switch to branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42`)).value (), {dst: 'TASK-42', action: 'switch', src: ''})
	})
	it ('create from release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 from release`)).value (), {dst: 'TASK-42', action: 'create', src: 'release'})
	})
	it ('deploy to release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 to release`)).value (), {src: 'TASK-42', action: 'merge', dst: 'release'})
	})
})
