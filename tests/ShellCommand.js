const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ShellCommand = require ('../lib/ShellCommand')


describe('random input', () => {
	it ('exit 1', async (t) => {
		assert.rejects(async () => {
			await new ShellCommand ({cmd: 'exit 1'}).run ()
		})
	})
	it ('echo 1', async (t) => {
		assert.strictEqual(await (new ShellCommand ({cmd: 'echo 1'}).run ()), '1')
	})
})
