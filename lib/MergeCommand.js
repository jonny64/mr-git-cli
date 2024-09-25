const GitBranch = require ('./GitBranch')

module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let {gitRepo, parsedArgs} = this
		let {src, dst} = await parsedArgs.value ()
		let srcBranch = GitBranch.withName (src, this.gitRepo)
		let dstBranch = GitBranch.withName (dst, this.gitRepo)

		let todo = []

		if (await srcBranch.current()) {
			await srcBranch.push ()
		}

		let toMergeAfter = await gitRepo.toMergeAfter (dstBranch)
		for (let branch of toMergeAfter.concat (dstBranch)) {
			todo = todo.concat (await this.mergeTodo (srcBranch, branch))
		}

		return { todo }
	}

	async mergeTodo (src, dst) {

		let {gitRepo} = this

		if (!await gitRepo.existInRemote (src)) {
			console.log (`Odd: branch '${await src.print ()}' does not exist`)
			return []
		}

		if (!await gitRepo.existInRemote (dst)) {
			console.log (`Odd: branch '${await dst.print ()}' does not exist`)
			return []
		}

		let cnt = await gitRepo.countDiffCommits (src, dst)
		if (cnt == 0) {
			console.log (`Odd: branch '${await src.print()}' is fully merged to '${await dst.print ()}'`)
			return []
		}

		if (cnt > 100) {
			console.log (`Odd: branch '${await src.print()}' differs from '${await dst.print ()}' by ${cnt} commits > 100: manual merge required`)
			return []
		}

		return [
			`git fetch`,
			`git checkout ${dst.name}`,
			`git reset --hard ${await dst.print ()}`,
			`git merge ${await src.print ()}`,
		].concat (
			await dst.pushTodo ({noMr: true})
		)
	}
}
