const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')
const GitBranch = require ('../lib/GitBranch')
const GitRepo = require ('../lib/GitRepo')


describe('random input', () => {
	mock.method(ShellCommand.prototype, 'runSilent', function () {
		switch (this.cmd) {
			case 'git log --oneline origin/main..origin/main':
				return ''
			case 'git log --oneline origin/TASK-42..origin/main':
				return `2a2dc99fda316150633352bc05691b855d433b65 commit msg\n84cbc4c680e92ddcee3ef7523afb17b658f8b39fcommit msg`
			default:
				throw new Error (`Command failed: git log --oneline origin/TASK-42..origin/main\nfatal: invalid reference: 'TASK-42'`)
		}

	})

	let gitRepo = new GitRepo ()
	let main = new GitBranch ({name: 'main', origin: 'origin'})
	let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin'})

	it ('countDiffCommits same branch', async (t) => {
		assert.strictEqual(await gitRepo.countDiffCommits (main, main), 0)
	})

	it ('countDiffCommits other branch', async (t) => {
		assert.strictEqual(await gitRepo.countDiffCommits (task42, main), 2)
	})
})
