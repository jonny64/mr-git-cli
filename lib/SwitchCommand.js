const GitBranch  = require('./GitBranch')
const Create  = require('./CreateCommand')

module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let {parsedArgs, gitRepo} = this
		let {dst} = await parsedArgs.value ()
		let dstBranch = GitBranch.withName (dst, gitRepo)

		if (!await gitRepo.existBranch (dstBranch)) {
			return new Create ({gitRepo, parsedArgs}).todo ()
		}

		return {
			todo: [
				`git fetch`,
				`git switch --merge --guess ${dst}`,
			]
		}
	}
}
