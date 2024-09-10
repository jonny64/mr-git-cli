
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')
const UserInput = require ('./UserInput')

module.exports = class {
	constructor() {
	}

	async switch (dst) {
		let result = ''
		try {
			result = await this.run (`switch --guess ${dst}`)
		} catch (x) {
			let defaultBranch = await this.defaultBranch ()
			defaultBranch.fetchOrigin()
			let src = await defaultBranch.fullName()
			result = await this.createAndSwitchToBranch (dst, src)
		}
		return result
	}

	async createAndSwitchToBranch (dst, src) {
		let ok = await new UserInput (`Create new branch '${dst}' from '${src}' [Y/n]? `).confirm ()
		if (!ok) {
			return
		}
		return this.run (`switch --guess --create ${dst} ${src}`)
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
