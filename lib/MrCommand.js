
const GitRepo = require ('./GitRepo')

module.exports = class MrCommand {
	constructor(o) {
		this.src = o.src
		this.dst = o.dst
		this.gitRepo = new GitRepo ()
	}

	async run () {
		let {gitRepo} = this
		if (this.src && !this.dst) {
			return await gitRepo.switch (this.src)
		}
		if (!this.src && !this.dst) {
			return (await gitRepo.currentBranch()).push ()
		}
		return (await gitRepo.currentBranch()).push ()
	}
}
