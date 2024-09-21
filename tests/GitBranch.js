const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitBranch = require ('../lib/GitBranch')

// @todo #0:1h improve file coverage at least funcs % 70
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
	let task42 = new GitBranch ({name: 'TASK-42', origin: 'origin'})

	it ('equals same branch', async (t) => {
		assert.strictEqual(await task42.equals (task42), true)
	})

})
