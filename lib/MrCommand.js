
const GitRepo = require ('./GitRepo')

module.exports = class MrCommand {
	constructor(o) {
		this.parsedArgs = o
		this.gitRepo = new GitRepo ()
	}

	async run () {
		let {gitRepo} = this
		let args = this.parsedArgs.value ()
		switch (args.action) {
			case 'push':
				return (await gitRepo.currentBranch()).push ()
			case 'switch':
				return await gitRepo.switch (args.dst)
			case 'create':
				return `not implemented (yet)!`
			case 'merge':
				return `not implemented (yet)!`
			default:
				throw new Error (`unknown action: ${args.action}!`)
		}
	}
}
