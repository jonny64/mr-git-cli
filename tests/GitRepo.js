const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitBranch = require ('../lib/GitBranch')
const GitRepo = require ('../lib/GitRepo')


describe('random input', () => {
	let gitRepo = new GitRepo ()
	let src = new GitBranch ({name: 'main', origin: 'origin'})
	it ('countDiffCommits same branch', async (t) => {
		assert.strictEqual(await gitRepo.countDiffCommits (src, src), 0)
	})
})
