module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let currentBranch = await this.gitRepo.currentBranch ()

		return {
			todo: await currentBranch.pushTodo ()
		}
	}
}
