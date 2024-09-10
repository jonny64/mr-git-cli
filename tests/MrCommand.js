const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const GitRepo = require ('../lib/GitRepo')
const GitBranch = require ('../lib/GitBranch')
const MrCommand = require ('../lib/MrCommand')
const ParsedArgs = require ('../lib/ParsedArgs')

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

	it ('push on empty arguments', async (t) => {
		const parsedArgs = new ParsedArgs ([])
		assert.ok(() => await (new MrCommand (parsedArgs).run ()))
	})

	it ('switch', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-42'])
		assert.strictEqual(await (new MrCommand (parsedArgs).run ()), `Switched to a new branch 'TASK-42'`)
	})
})
