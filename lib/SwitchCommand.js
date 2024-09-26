const GitBranch  = require('./GitBranch')
const Create  = require('./CreateCommand')

module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
		this.createCommand = o.createCommand
	}

	async todo () {
		let {parsedArgs, gitRepo} = this
		let {dst} = await parsedArgs.value ()
		let dstBranch = GitBranch.withName (dst, gitRepo)

		if (!await gitRepo.existBranch (dstBranch)) {
			return this.createCommand.todo ()
		}

		return {
			todo: [
				`git fetch`,
				`git switch --merge --guess ${dst}`,
			]
		}
	}
}
