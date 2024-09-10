const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const GitRepo = require ('../lib/GitRepo')
const GitBranch = require ('../lib/GitBranch')
const MrCommand = require ('../lib/MrCommand')

describe('random input', () => {
    mock.method(ShellCommand.prototype, 'run', function () {
		switch (this.cmd) {
			case 'git switch --merge --guess TASK-42':
			case 'git switch --merge --guess --create TASK-42':
				return `Switched to a new branch 'TASK-42'`
			default:
				throw `Command failed: git switch --merge --guess 'TASK-42'\nfatal: invalid reference: 'TASK-42'`
		}

	})

	mock.method(GitRepo.prototype, 'currentBranch', function () {
		return new GitBranch ({ name: 'TASK-42' })
	})

	it ('empty arguments', async (t) => {
		assert.throws(() => await (new MrCommand ({}).run ()))
	})

	it ('switch', async (t) => {
		assert.strictEqual(await (new MrCommand ({dst: 'TASK-42', action: 'switch', src: ''}).run ()), `Switched to a new branch 'TASK-42'`)
	})
})
