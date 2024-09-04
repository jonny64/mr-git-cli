const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const MrCommand = require ('../lib/MrCommand')

describe('random input', () => {
    mock.method(ShellCommand.prototype, 'run', function () {
		switch (this.cmd) {
			case 'git switch --guess --create TASK-42':
				return `Switched to a new branch 'TASK-42'`
			default:
				throw `A branch named 'TASK-42' already exists`
		}

	})

	it ('empty arguments', async (t) => {
		assert.throws(() => await (new MrCommand ({}).run ()))
	})

	it ('switch', async (t) => {
		assert.strictEqual(await (new MrCommand ({src: 'TASK-42', dst: 'master'}).run ()), `Switched to a new branch 'TASK-42'`)
	})
})