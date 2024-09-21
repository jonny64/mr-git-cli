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

		// @todo #0:30m move to currentBranch.current ()
		let currentBranch = await gitRepo.currentBranch ()
		if (await currentBranch.equals (srcBranch)) {
			await currentBranch.push ()
		}

		// @todo #0:1h implement branch dependency merge
		// e.g. merge to main should cause merge to release also
		// store branch dependency specific for project using 'git config' keys
		todo = todo.concat (await this.mergeTodo (srcBranch, dstBranch))

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

		let todo =[
			`fetch`,
			`checkout ${dst.name}`,
			`reset --hard ${await dst.print ()}`,
			`merge ${await src.print ()}`,
			// @todo #0:30m use PushCommand instead
			`push --set-upstream`,
		]

		return todo.map (i => ({todo: i}))
	}
}
