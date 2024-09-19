const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const GitBranch = require ('../lib/GitBranch')


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
