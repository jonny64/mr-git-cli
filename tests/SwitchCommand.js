const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const Switch = require ('../lib/SwitchCommand')
const GitRepo = require ('../lib/GitRepo')
const GitBranch = require ('../lib/GitBranch')
const ParsedArgs = require ('../lib/ParsedArgs')

describe('git old', () => {

	mock.method(GitRepo.prototype, 'run', async function (cmd) {
		switch (cmd) {
			case 'git branch --list TASK-42': return false
			case 'git branch --list TASK-43': return false
			default: throw new Error (`Unknown command: ${cmd}`)
		}
	})

	mock.method(GitRepo.prototype, 'existInRemote', async function (src) {
		const branch = await src.print ()
		switch (branch) {
			case 'origin/TASK-42': return false
			case 'origin/TASK-43': return true
			default: throw new Error (`Unknown branch: ${branch}`)
		}
	})

	const gitRepo = new GitRepo ()
	const createCommand = {
		todo: async function () {
			return {todo: ['create']}
		}
	}

	it ('create', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-42'])
		const cmd = new Switch ({gitRepo, parsedArgs, createCommand})
		const todo = await cmd.todo ()
		assert.deepStrictEqual(todo, {todo: [ 'create' ]} )
	})

	it ('switch', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-43'])
		const cmd = new Switch ({gitRepo, parsedArgs, createCommand})
		const todo = await cmd.todo ()
		assert.deepStrictEqual(todo, {todo: [
			'git fetch',
			'git switch --guess --merge TASK-43',
		]})
	})

})
