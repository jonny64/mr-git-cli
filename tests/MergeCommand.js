const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const GitRepo = require ('../lib/GitRepo')
const GitBranch = require ('../lib/GitBranch')
const MergeCommand = require ('../lib/MergeCommand')
const ParsedArgs = require ('../lib/ParsedArgs')

describe('MergeCommand', () => {
	let f = function () {
		switch (this.cmd) {
			case "git config mr.master.mergeAfter --default ''":
				return [GitBranch.withName ('test')]
			case "git push --set-upstream origin TASK-42:TASK-42":
			case "git push --set-upstream origin TASK-0:TASK-0":
			case "git push --set-upstream origin TASK-9:TASK-9":
			case "git push --set-upstream origin dummy:dummy":
				return "pushed"
			case "git config --default '' --get mr.test":
				return "npm test"
			case "npm test":
				return "OK"
			default:
				throw new Error (`Unknown command: ${this.cmd}`)
		}

	}
	mock.method(ShellCommand.prototype, 'run', f)
	mock.method(ShellCommand.prototype, 'runSilent', f)

	mock.method(GitBranch.prototype, 'isOriginGitlab', function () {
		return false
	})

	mock.method(GitBranch.prototype, 'current', function () {
		return true
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
	mock.method(GitRepo.prototype, 'countDiffCommits', async function (src, dst) {
		if (await src.equals (GitBranch.withName ('TASK-0'))) {
			return 0
		}
		if (await src.equals (GitBranch.withName ('TASK-9'))) {
			return 101
		}
		return 1
	})

	mock.method(GitRepo.prototype, 'existInRemote', async function (dst) {
		return !await dst.equals (GitBranch.withName ('dummy'))
	})

	mock.method(GitRepo.prototype, 'toMergeAfter', async function (dst) {
		if (await dst.equals (GitBranch.withName ('master'))) {
			return [GitBranch.withName ('test', this)]
		}
		return []
	})

	it ('master mergeAfter test', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-42', 'to', 'master'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
				'git fetch',
				'git checkout test',
				'git reset --hard origin/test',
				'git merge origin/TASK-42',
				'npm test',
				'git push --set-upstream origin test:test',
				'git fetch',
				'git checkout master',
				'git reset --hard origin/master',
				'git merge origin/TASK-42',
				'npm test',
				'git push --set-upstream origin master:master',
				'git checkout TASK-42',
			]
		})
	})

	it ('dst missing branch', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-42', 'to', 'dummy'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
			]
		})
	})

	it ('src missing branch', async (t) => {
		const parsedArgs = new ParsedArgs (['dummy', 'to', 'master'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
			]
		})
	})

	it ('src fully merged branch', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-0', 'to', 'master'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
			]
		})
	})

	it ('src diverged branch', async (t) => {
		const parsedArgs = new ParsedArgs (['TASK-9', 'to', 'master'])
		const gitRepo = new GitRepo ()
		const todo = await new MergeCommand ({parsedArgs, gitRepo}).todo()
		assert.deepStrictEqual(todo, {
			todo: [
			]
		})
	})
})
