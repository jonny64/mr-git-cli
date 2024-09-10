
const GitRepo = require ('./GitRepo')

module.exports = class MrCommand {
	constructor(o) {
		this.src = o.src
		this.dst = o.dst
		this.action = o.action
		this.gitRepo = new GitRepo ()
	}

	async run () {
		let {gitRepo} = this
		switch (this.action) {
			case 'push':
				return (await gitRepo.currentBranch()).push ()
			case 'switch':
				return await gitRepo.switch (this.dst)
			case 'create':
				return `not implemented (yet)!`
			case 'merge':
				return `not implemented (yet)!`
			default:
				throw new Error (`unknown action: ${this.action}!`)
		}
	}
}
