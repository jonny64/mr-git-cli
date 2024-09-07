
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')

module.exports = class {
	constructor() {
	}

	async switch (dst) {
		let result = ''
		try {
			result = await this.run (`switch --guess ${dst}`)
		} catch (x) {
			result = await this.run (`switch --guess --create ${dst}`)
		}
		return result
	}

	async currentBranch () {
		let name = await this.run (`symbolic-ref --short HEAD`)
		return new GitBranch ({ name, repo: this })
	}

	async defaultBranch () {
		return (await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)).split ('origin/').join ('')
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
