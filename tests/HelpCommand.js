const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const MrCommand = require ('../lib/MrCommand')
const ParsedArgs = require ('../lib/ParsedArgs')

describe('HelpCommand', () => {
	it ('help command prints help and returns empty todo', async (t) => {
		const logCalls = []
		mock.method(console, 'log', function(msg) {
			logCalls.push(msg)
		})

		const parsedArgs = new ParsedArgs (['-h'])
		const todo = await MrCommand.withParsedArgs (parsedArgs).todo()

		assert.deepStrictEqual(todo.todo, [])
		assert.ok(logCalls[0].startsWith('mr -h | --help'))
	})

	it ('--help flag works the same way', async (t) => {
		const logCalls = []
		mock.method(console, 'log', function(msg) {
			logCalls.push(msg)
		})

		const parsedArgs = new ParsedArgs (['--help'])
		const todo = await MrCommand.withParsedArgs (parsedArgs).todo()

		assert.deepStrictEqual(todo.todo, [])
		assert.ok(logCalls[0].startsWith('mr -h | --help'))
	})
})
