const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitOld = require ('../lib/GitOld')
const GitRepo = require ('../lib/GitRepo')

describe('git old', () => {
	mock.method(GitRepo.prototype, 'run', function (cmd) {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (cmd) {
			case 'git diff-files || true': return ''
		}
	})

	const gitRepo = new GitRepo ()
	const gitOld = new GitOld ({gitRepo})
	const version = '2.11.0'

	it ('switch', async (t) => {
		const asIs = [
			'git fetch',
			'git switch --guess --merge TASK-42'
		]
		const toBe = [
			'git fetch',
			'git checkout TASK-42'
		]
		assert.deepStrictEqual(
			await gitOld.translate  ({todo: asIs, version}),
			{todo: toBe, version}
		)
	})

	it ('create', async (t) => {
		const asIs = [
			`git fetch`,
			`git switch --guess --merge --create TASK-42 origin/release`,
			`git config branch.TASK-42.mr-target origin/release`,
		]
		const toBe = [
			`git fetch`,
			`git checkout -b TASK-42 origin/release`,
			`git config branch.TASK-42.mr-target origin/release`,
		]
		assert.deepStrictEqual(
			await gitOld.translate  ({todo: asIs, version}),
			{todo: toBe, version}
		)
	})

	it ('merge', async (t) => {
		const asIs = [
			`git fetch`,
			`git checkout release`,
			`git reset --hard origin/release`,
			`git merge TASK-42`,
		]
		const toBe = [
			`git fetch`,
			`git checkout release`,
			`git reset --hard origin/release`,
			`git merge TASK-42`,
		]
		assert.deepStrictEqual(
			await gitOld.translate  ({todo: asIs, version}),
			{todo: toBe, version}
		)
	})

	it ('switch new git', async (t) => {
		const asIs = [
			'git fetch',
			'git switch --guess --merge TASK-42'
		]
		const version = '2.24.1'
		assert.deepStrictEqual(
			await gitOld.translate  ({todo: asIs, version}),
			{todo: asIs, version}
		)
	})

	describe('isVersionAtLeast', () => {
		it ('should handle leading space (real git output)', (t) => {
			assert.strictEqual(GitOld.isVersionAtLeast(' 2.50.1.windows.1', '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast(' 2.40.0', '2.23'), true)
		})

		it ('should compare versions correctly', (t) => {
			assert.strictEqual(GitOld.isVersionAtLeast('2.50.1', '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast('2.24.1', '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast('2.23.0', '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast('2.22.0', '2.23'), false)
			assert.strictEqual(GitOld.isVersionAtLeast('2.11.0', '2.23'), false)
		})

		it ('should handle major version differences', (t) => {
			assert.strictEqual(GitOld.isVersionAtLeast('3.0.0', '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast('1.99.0', '2.23'), false)
		})

		it ('should return true for undefined/null (assume modern git)', (t) => {
			assert.strictEqual(GitOld.isVersionAtLeast(undefined, '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast(null, '2.23'), true)
			assert.strictEqual(GitOld.isVersionAtLeast('', '2.23'), true)
		})
	})
})
