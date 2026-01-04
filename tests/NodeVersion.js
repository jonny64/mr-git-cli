const {describe, it} = require('node:test')
const assert = require('assert')
const NodeVersion = require('../lib/NodeVersion')

describe('NodeVersion', () => {

	it('valid when major >= min', () => {
		const v = new NodeVersion({node: '>=18'}, '20.10.0')
		assert.ok(v.isValid())
	})

	it('valid when major == min', () => {
		const v = new NodeVersion({node: '>=18'}, '18.0.0')
		assert.ok(v.isValid())
	})

	it('invalid when major < min', () => {
		const v = new NodeVersion({node: '>=18'}, '16.20.0')
		assert.ok(!v.isValid())
	})

	it('toError returns message', () => {
		const v = new NodeVersion({node: '>=18'}, '16.20.0')
		assert.equal(v.toError(), 'Node.js 18+ required (current: v16.20.0)')
	})
})
