const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitBranch = require ('../lib/GitBranch')
const GitRepo = require ('../lib/GitRepo')
const ShellCommand= require ('../lib/ShellCommand')

describe('git branch print', () => {
	let task42 = GitBranch.withName ('TASK-42')
	let task43 = GitBranch.withName ('gh/TASK-42')

	it ('should print', async (t) => {
		assert.strictEqual(await task42.print(), 'origin/TASK-42')
		assert.strictEqual(await task43.print(), 'gh/TASK-42')
	})

})

describe('git branch equals', () => {
	let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin'})
	let task43 = new GitBranch ({name: 'TASK-43', origin: 'origin'})

	it ('equals same branch', async (t) => {
		assert.strictEqual(await task42.equals (task42), true)
	})

	it ('equals other branch', async (t) => {
		assert.strictEqual(await task42.equals (task43), false)
	})
})

describe('git branch mrTitle', () => {
	mock.method(ShellCommand.prototype, 'runSilent', function () {
		switch (this.cmd) {
			case 'git log --reverse --pretty=format:%s origin/master..TASK-42':
				return 'TASK-42 commit msg'
			case 'git log --reverse --pretty=format:%s gitlab/release..43':
				return `43 commit msg\n43 other commit msg`
			case 'git log --reverse --pretty=format:%s origin/master..44':
				return `44 fix 'quotes'\n44 other fix 'quotes'`
			case 'git log --reverse --pretty=format:%s origin/master..EMPTY-45':
				return ''
			case 'git symbolic-ref refs/remotes/origin/HEAD --short':
				return 'origin/master'
			default:
				throw new Error (`Unknown command: ${this.cmd}`)
		}
	})

	mock.method(GitRepo.prototype, 'config', function (key) {
		switch (key) {
			case 'branch.TASK-42.mr-target': return 'origin/master'
			case 'branch.43.mr-target': return 'gitlab/release'
			case 'branch.44.mr-target': return ''
			case 'branch.EMPTY-45.mr-target': return ''
			default: throw new Error (`Unknown config: ${key}`)
		}
	})

	const gitRepo = new GitRepo ()

	let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin', gitRepo})
	let task43 = new GitBranch ({name: '43', origin: 'gitlab', gitRepo})
	let task44 = new GitBranch ({name: '44', origin: 'gitlab', gitRepo})
	let task45 = new GitBranch ({name: 'EMPTY-45', origin: 'origin', gitRepo})

	it ('mrTitle', async (t) => {
		assert.strictEqual(await task42.mrTitle (), "TASK-42 commit msg", "first commit msg of branch named with prefix")
		assert.strictEqual(await task43.mrTitle (), "TASK-43 commit msg", "first commit msg of branch named digits only")
		assert.strictEqual(await task44.mrTitle (), `TASK-44 fix '"'"'quotes'"'"'`, "gitlab push options escape quotes in bash")
		assert.strictEqual(await task45.mrTitle (), "EMPTY-45", "no commit msg for empty branch")
	})

})
