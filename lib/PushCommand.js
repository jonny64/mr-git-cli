module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let currentBranch = await this.gitRepo.currentBranch ()

		// @todo run npm test before push
		// use 'git config' to specify project specific test command
		return {
			todo: [
				{todo: await currentBranch.pushTodo ()}
			]
		}
	}
}
