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
})
