const {describe, it} = require ('node:test')
const assert = require ('assert')
const ShellCommandLogged = require ('../lib/ShellCommandLogged')

describe('ShellCommandLogged', () => {

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

	it ('fuzz', async (t) => {
		global.FUZZ = 1
		global.FUZZ_SHELL_REPLY = 'fake ok'
		assert.strictEqual(await (new ShellCommandLogged ({cmd: 'git status'}).run ()), 'fake ok')
		global.FUZZ = 0
	})

	it ('#113 streamed jest output not duplicated on failure', async (t) => {
		const longOutput = Array(10).fill('PASS tests/GitBranch.js').join('\n') + '\nTests: 10 passed, 10 total'
		const spawn = makeSpawnMock ({stdout: '', stderr: longOutput, close: 1})
		try {
			await new ShellCommandLogged ({cmd: 'npm test', spawn}).run ()
			assert.fail('should throw')
		} catch (err) {
			assert.ok(err.message.includes('PASS'))
			assert.strictEqual(err.toString(), '')
		}
	})
})
