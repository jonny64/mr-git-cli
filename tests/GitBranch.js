const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitBranch = require ('../lib/GitBranch')
const GitRepo = require ('../lib/GitRepo')
const ShellCommand= require ('../lib/ShellCommand')
const ORIGIN_MASTER = 'origin/master'

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
		case 'git log --reverse --pretty=format:%s gitlab/release..r46':
			return `46 commit msg\n46 other commit msg`
		case 'git symbolic-ref refs/remotes/origin/HEAD --short':
			return ORIGIN_MASTER
		default:
			throw new Error (`Unknown command: ${this.cmd}`)
	}
})

mock.method(GitRepo.prototype, 'config', function (key) {
	switch (key) {
		case 'branch.TASK-42.mr-target': return ORIGIN_MASTER
		case 'branch.TASK-42.description': return ''
		case 'branch.r44.description': return ''
		case 'branch.43.mr-target': return 'gitlab/release'
		case 'branch.43.description': return ''
		case 'branch.44.mr-target': return ''
		case 'branch.EMPTY-45.mr-target': return ''
		case 'branch.r46.mr-target': return 'gitlab/release'
		case 'remote.origin.url': return 'git@gitlab.local'
		default: throw new Error (`Unknown config: ${key}`)
	}
})

describe('git branch mrTitle', () => {

	const gitRepo = new GitRepo ()

	let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin', gitRepo})
	let task43 = new GitBranch ({name: '43', origin: 'gitlab', gitRepo})
	let task44 = new GitBranch ({name: '44', origin: 'gitlab', gitRepo})
	let task45 = new GitBranch ({name: 'EMPTY-45', origin: 'origin', gitRepo})
	let task46 = new GitBranch ({name: 'r46', origin: 'origin', gitRepo})

	it ('mrTitle', async (t) => {
		assert.strictEqual(await task42.mrTitle (), "TASK-42 commit msg", "first commit msg of branch named with prefix")
		assert.strictEqual(await task43.mrTitle (), "TASK-43 commit msg", "first commit msg of branch named digits only")
		assert.strictEqual(await task44.mrTitle (), `TASK-44 fix '"'"'quotes'"'"'`, "gitlab push options escape quotes in bash")
		assert.strictEqual(await task45.mrTitle (), "EMPTY-45", "no commit msg for empty branch")
		assert.strictEqual(await task46.mrTitle (), "TASK-46 commit msg", "release branch gitlab external issue tracker link")
	})

	describe ('gitlab push options', () => {
		let gitRepo = new GitRepo ()
		let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin', gitRepo})
		let task43 = new GitBranch ({name: '43', origin: 'gitlab', gitRepo})
		let taskRelease = new GitBranch ({name: 'r44', origin: 'gitlab', gitRepo})

		it ('noMr', async (t) => {
			assert.strictEqual(await task42.gitlabPushOptions ({noMr: true}), '')
		})
		it ('noMr', async (t) => {
			assert.strictEqual(await task42.gitlabPushOptions (), ` -o merge_request.create -o merge_request.title='TASK-42 commit msg' -o merge_request.target=master`)
		})
		it ('gitlab origin', async (t) => {
			assert.strictEqual(await task43.gitlabPushOptions (), ` -o merge_request.create -o merge_request.title='TASK-43 commit msg' -o merge_request.target=release`)
		})
	})

})
