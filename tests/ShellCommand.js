const {describe, it} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')


describe('ShellCommand', () => {

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
				if (event === 'close') {
					return callback(o.close)
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
		const spawn = makeSpawnMock ({stdout: '', stderr: '', close: 0})
		assert.strictEqual(await (new ShellCommand ({cmd: 'git fetch', spawn}).run ()), '')
	})

	it ('exec fail', async (t) => {
		const spawn = makeSpawnMock ({stdout: '', stderr: 'not a repo', close: -127})
		assert.rejects(new ShellCommand ({cmd: 'git fetch', spawn}).run (), {message: 'not a repo'})
	})

	it ('fuzz', async (t) => {
		global.FUZZ = 1
		global.FUZZ_SHELL_REPLY = 'fake ok'
		assert.strictEqual(await (new ShellCommand ({cmd: 'git status'}).run ()), 'fake ok')
		global.FUZZ = 0
	})
})
