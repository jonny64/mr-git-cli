const GitBranch = require ('./GitBranch')

module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
		this.isFuzz = o.isFuzz
	}

	async todo () {
		let {gitRepo, parsedArgs} = this
		let {src, dst} = await parsedArgs.value ()
		let srcBranch = GitBranch.withName (src, this.gitRepo)
		let dstBranch = GitBranch.withName (dst, this.gitRepo)

		if (await srcBranch.current()) {
			await srcBranch.push ()
		}

		let todo = []
		let toMergeAfter = await gitRepo.toMergeAfter (dstBranch)
		for (let branch of toMergeAfter.concat (dstBranch)) {
			todo = todo.concat (await this.mergeTodo (srcBranch, branch))
		}
		if (todo.length) {
			todo = todo.concat (`git checkout ${src}`)
		}

		return { todo }
	}

	async mergeTodo (src, dst) {

		let {gitRepo} = this

		if (!await gitRepo.existInRemote (src)) {
			this.log (`Odd: branch '${await src.print ()}' does not exist`)
			return []
		}

		if (!await gitRepo.existInRemote (dst)) {
			this.log (`Odd: branch '${await dst.print ()}' does not exist`)
			return []
		}

		let cnt = await gitRepo.countDiffCommits (src, dst)
		if (cnt == 0) {
			this.log (`Odd: branch '${await src.print()}' is fully merged to '${await dst.print ()}'`)
			return []
		}

		if (cnt > 100) {
			this.log (`Odd: branch '${await src.print()}' differs from '${await dst.print ()}' by ${cnt} commits > 100: manual merge required`)
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

	log (label) {
		if (this.isFuzz) {
			return ''
		}
		console.log (label)
	}

}
