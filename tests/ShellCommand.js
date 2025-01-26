const {describe, it} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')


describe('random input', () => {

	const makeSpawnMock = (o = {}) => {

		const {stdout, stderr, close} = o

		return (command, args, options) => ({
			stdout: {
				on: (event, callback) => {
					if (event === 'data') {
						return callback(`${stdout}\n`)
					}
				},
			},
			stderr: {
				on: (event, callback) => {
					if (event === 'data') {
						return callback(`${stderr}\n`)
					}
				},
			},
			on: (event, callback) => {
				if (event === 'exit') {
					return callback(o.exit)
				}
			},
		})
	}

	it ('exit 1', async (t) => {
		assert.rejects(async () => {
			await ShellCommand.withText ('exit 1').run ()
		})
	})

	it ('echo 1', async (t) => {
		assert.strictEqual(await (ShellCommand.withText ('echo 1').run ()), '1')
	})

	it ('exec ok', async (t) => {
		const spawn = makeSpawnMock ({stdout: '', stderr: '', exit: 0})
		assert.strictEqual(await (new ShellCommand ({cmd: 'git fetch', spawn}).runSilent ()), '')
	})

	it ('exec fail', async (t) => {
		const spawn = makeSpawnMock ({stdout: '', stderr: 'not a repo', exit: -127})
		assert.rejects(new ShellCommand ({cmd: 'git fetch', spawn}).runSilent (), {message: 'not a repo'})
	})

	it ('git status fuzz', async (t) => {
		global.FUZZ = 1
		global.FUZZ_SHELL_REPLY = 'fake ok'
		assert.strictEqual(await (new ShellCommand ({cmd: 'git status'}).run ()), 'fake ok')
		global.FUZZ = 0
	})

	it ('git status silent fuzz', async (t) => {
		global.FUZZ = 1
		global.FUZZ_SHELL_REPLY = 'fake ok'
		assert.strictEqual(await (new ShellCommand ({cmd: 'git status'}).runSilent ()), 'fake ok')
		global.FUZZ = 0
	})
})
