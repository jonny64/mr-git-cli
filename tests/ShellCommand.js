const {describe, it} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')


describe('random input', () => {
	it ('exit 1', async (t) => {
		assert.rejects(async () => {
			await ShellCommand.withText ('exit 1').run ()
		})
	})

	it ('echo 1', async (t) => {
		assert.strictEqual(await (ShellCommand.withText ('echo 1').run ()), '1')
	})

	it ('exec ok', async (t) => {
		const exec = (cmd, o, callback) => callback ('', '', '')
		assert.strictEqual(await (new ShellCommand ({cmd: 'git fetch', exec}).runSilent ()), '')
	})

	it ('exec fail', async (t) => {
		const exec = (cmd, o, callback) => callback (new Error ('Command failed: '), 'not a repo', '')
		assert.rejects(new ShellCommand ({cmd: 'git fetch', exec}).runSilent (), {message: 'not a repo'})
	})

	it ('git status fuzz', async (t) => {
		assert.strictEqual(await (new ShellCommand ({cmd: 'git status', isFuzz: true}).run ()), '')
	})

	it ('git status silent fuzz', async (t) => {
		assert.strictEqual(await (new ShellCommand ({cmd: 'git status', isFuzz: true}).runSilent ()), '')
	})
})
