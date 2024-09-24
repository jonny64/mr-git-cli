const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const GitRepo = require ('../lib/GitRepo')
const GitBranch = require ('../lib/GitBranch')
const MergeCommand = require ('../lib/MergeCommand')
const ParsedArgs = require ('../lib/ParsedArgs')

describe('MergeCommand', () => {
	let f = function () {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (this.cmd) {
			case "git config mr.master.mergeAfter --default ''":
				return [GitBranch.withName ('test')]
			default:
				throw new Error (`Unknown command: ${this.cmd}`)
		}

	}
	mock.method(ShellCommand.prototype, 'run', f)
	mock.method(ShellCommand.prototype, 'runSilent', f)

	mock.method(GitBranch.prototype, 'isOriginGitlab', function () {
		return false
	})

	mock.method(GitRepo.prototype, 'currentBranch', function () {
		return new GitBranch ({ name: 'TASK-42', origin: 'gitlab' })
	})

	mock.method(GitRepo.prototype, 'defaultBranch', function () {
		return new GitBranch ({ name: 'main', origin: 'gitlab' })
	})

	mock.method(GitRepo.prototype, 'existInRemote', function () {
		return true
	})
	mock.method(GitRepo.prototype, 'countDiffCommits', function () {
		return 1
	})

	mock.method(GitRepo.prototype, 'toMergeAfter', function () {
		return [GitBranch.withName ('test')]
	})

	it ('master mergeAfter test', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-42', 'to', 'master'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
				{ todo: 'fetch' },
				{ todo: 'checkout test' },
				{ todo: 'reset --hard origin/test' },
				{ todo: 'merge origin/TASK-42' },
				{ todo: 'push --set-upstream origin test:test' },
				{ todo: 'fetch' },
				{ todo: 'checkout master' },
				{ todo: 'reset --hard origin/master' },
				{ todo: 'merge origin/TASK-42' },
				{ todo: 'push --set-upstream origin master:master' }
			]
		})
	})
})
