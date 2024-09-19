module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let {gitRepo, parsedArgs} = this
		let {src, dst} = await parsedArgs.value ()
		let srcBranch = await gitRepo.getBranch (src)
		let dstBranch = await gitRepo.getBranch (dst)

		let todo = []

		let currentBranch = await gitRepo.currentBranch ()
		if (await currentBranch.equals (srcBranch)) {
			await currentBranch.push ()
		}

		todo = todo.concat (await this.mergeTodo (srcBranch, dstBranch))

		return { todo }
	}

	async mergeTodo (src, dst) {

		let {gitRepo} = this

		if (!await gitRepo.existInRemote (src)) {
			console.log (`Odd: branch '${await src.fullName ()}' does not exist`)
			return []
		}

		if (!await gitRepo.existInRemote (dst)) {
			console.log (`Odd: branch '${await dst.fullName ()}' does not exist`)
			return []
		}

		let cnt = await gitRepo.countDiffCommits (src, dst)
		if (cnt == 0) {
			console.log (`Odd: branch '${await src.fullName()}' is fully merged to '${await dst.fullName ()}'`)
			return []
		}

		if (cnt > 100) {
			console.log (`Odd: branch '${await src.fullName()}' differs from '${await dst.fullName ()}' by ${cnt} commits > 100: manual merge required`)
			return []
		}

		let todo =[
			`fetch`,
			`checkout ${dst.name}`,
			`reset --hard ${await dst.fullName ()}`,
			`merge ${await src.fullName ()}`,
			`push --set-upstream`,
		]

		return todo.map (i => ({todo: i}))
	}
}
