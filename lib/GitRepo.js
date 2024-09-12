
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')

module.exports = class {
	constructor() {
	}

	async currentBranch () {
		let name = await this.run (`symbolic-ref --short HEAD`)
		return new GitBranch ({ name, origin: 'origin', repo: this })
	}

	async defaultBranch () {
		let [origin, name] = (await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)).split ('/')
		return new GitBranch ({ name, origin, repo: this })
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
