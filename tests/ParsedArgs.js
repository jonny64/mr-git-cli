const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ParsedArgs = require ('../lib/ParsedArgs')


describe('ParsedArgs', () => {
	const toArgv = s => s.split (/\s+/)
	it ('2 args not valid', async (t) => {
		assert.throws(() => new ParsedArgs (toArgv (`TASK-42 from`)).value ())
	})
	it ('2 args create not valid', async (t) => {
		assert.throws(() => new ParsedArgs (toArgv (`TASK-42 origin/release`)).value ())
	})
	it ('push branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs ([]).value (), {dst: '', action: 'Push', src: '__CURRENT_BRANCH__'})
	})
	it ('switch to branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42`)).value (), {dst: 'TASK-42', action: 'Switch', src: ''})
	})
	it ('create from release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 from release`)).value (), {dst: 'TASK-42', action: 'Create', src: 'release'})
	})
	it ('deploy to release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 to release`)).value (), {src: 'TASK-42', action: 'Merge', dst: 'release'})
	})
	it ('deploy current to release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`to release`)).value (), {src: '__CURRENT_BRANCH__', action: 'Merge', dst: 'release'})
	})
	it ('help with -h flag', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (['-h']).value (), {action: 'Help'})
	})
	it ('help with --help flag', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (['--help']).value (), {action: 'Help'})
	})
})
