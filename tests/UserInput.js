const {describe, it, mock} = require('node:test')
const assert = require('assert')
const UserInput = require('../lib/UserInput')

describe('UserInput', () => {
	const PLEASE_ANSWER_MESSAGE = "Please answer 'y' or 'n'"
	const TEST_MESSAGE = 'test message'

	it('ask() returns FUZZ_USER_REPLY when FUZZ is enabled', async () => {
		const originalFuzz = global.FUZZ
		const originalReply = global.FUZZ_USER_REPLY

		try {
			global.FUZZ = true
			global.FUZZ_USER_REPLY = '  YeS  '

			const ui = new UserInput({question: 'Test question?'})
			const result = await ui.ask()

			assert.strictEqual(result, '  YeS  ')
		} finally {
			global.FUZZ = originalFuzz
			global.FUZZ_USER_REPLY = originalReply
		}
	})

	it('confirm() returns true for positive answers', async () => {
		const positiveAnswers = ['y', 'yes', '']

		for (const answer of positiveAnswers) {
			const ui = new UserInput({question: 'Confirm?'})
			ui.ask = async () => answer

			const result = await ui.confirm()
			assert.strictEqual(result, true, `Expected true for answer: "${answer}"`)
		}
	})

	it('confirm() returns false for negative answers', async () => {
		const negativeAnswers = ['n', 'no']

		for (const answer of negativeAnswers) {
			const ui = new UserInput({question: 'Confirm?'})
			ui.ask = async () => answer

			const result = await ui.confirm()
			assert.strictEqual(result, false, `Expected false for answer: "${answer}"`)
		}
	})

	it('confirm() retries on invalid input and succeeds on valid input', async () => {
		const logCalls = []
		mock.method(console, 'log', function(msg) {
			logCalls.push(msg)
		})

		const replies = ['maybe', 'y']
		const ui = new UserInput({question: 'Confirm?'})
		ui.ask = async () => replies.shift()

		const result = await ui.confirm()

		assert.strictEqual(result, true)
		assert.strictEqual(logCalls.length, 1)
		assert.ok(logCalls[0].includes(PLEASE_ANSWER_MESSAGE))
	})

	it('confirm() gives up after 3 invalid attempts', async () => {
		const logCalls = []
		mock.method(console, 'log', function(msg) {
			logCalls.push(msg)
		})

		const replies = ['foo', 'bar', 'baz']
		const ui = new UserInput({question: 'Confirm?'})
		ui.ask = async () => replies.shift()

		const result = await ui.confirm()

		assert.strictEqual(result, false)
		assert.strictEqual(logCalls.length, 3)
		logCalls.forEach(call => {
			assert.ok(call.includes(PLEASE_ANSWER_MESSAGE))
		})
	})

	it('log() returns empty string and does not log when FUZZ is enabled', async () => {
		const originalFuzz = global.FUZZ

		try {
			global.FUZZ = true

			const logCalls = []
			mock.method(console, 'log', function(msg) {
				logCalls.push(msg)
			})

			const ui = new UserInput({question: 'Test?'})
			const result = ui.log(TEST_MESSAGE)

			assert.strictEqual(result, '')
			assert.strictEqual(logCalls.length, 0)
		} finally {
			global.FUZZ = originalFuzz
		}
	})

	it('log() calls console.log when FUZZ is not enabled', async () => {
		const originalFuzz = global.FUZZ

		try {
			global.FUZZ = false

			const logCalls = []
			mock.method(console, 'log', function(msg) {
				logCalls.push(msg)
			})

			const ui = new UserInput({question: 'Test?'})
			ui.log(TEST_MESSAGE)

			assert.strictEqual(logCalls.length, 1)
			assert.strictEqual(logCalls[0], TEST_MESSAGE)
		} finally {
			global.FUZZ = originalFuzz
		}
	})
})
