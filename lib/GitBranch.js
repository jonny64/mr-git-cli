const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {

	static withName (id, gitRepo) {
		let [origin, name] = id.split ('/')
		if (!name) {
			name = origin
			origin = 'origin'
		}
		return new GitBranch ({ name, origin, gitRepo })
	}

	constructor(o) {
		this.name = o.name
		this.origin = o.origin
		this.gitRepo = o.gitRepo
		this.isFuzz = process.env.FUZZ_TIME
	}

	async push () {
		for (let i of await this.pushTodo ()) {
			await ShellCommand.withText(i).run ()
		}
	}

	async pushTodo (o = {}) {
		let {name} = this, opt = await this.gitlabPushOptions (o)

		let todo = await this.gitRepo.toTest ()

		todo = todo.concat (`git push --set-upstream ${this.origin} ${name}:${name}${opt}`)

		if (opt) {
			let title = await this.mrTitle ()
			todo = todo.concat (`git config branch.${name}.description '${title}'`)
		}

		return todo
	}

	async gitlabPushOptions (o = {}) {
		if (o.noMr || !await this.isOriginGitlab ()) {
			return ''
		}

		let mrSet = await this.gitRepo.config (`branch.${this.name}.description`)

		if (mrSet && !this.isFuzz) {
			return ''
		}

		let parentBranch = await this.parentBranch ()
		let mrTitle = await this.mrTitle ()
		return ` -o merge_request.create -o merge_request.title='${mrTitle}' -o merge_request.target=${parentBranch.name}`
	}

	async mrTitle () {
		let parentBranch = await (await this.parentBranch ()).print ()
		let diff = await this.run (`git log --reverse --pretty=format:%s ${parentBranch}..${this.name}`)
		let firstCommitMsg = this.isFuzz? this.name
			: diff.split (`\n`).filter (i => !i.startsWith ('warning:')).at (0)

		let toTaskHref = s => s.replace (/^(\d+)(\S+)?\s*/, 'TASK-$1 ')
			.replace (/^\w(\d+)(\S+)?\s*/, 'TASK-$1 ')
			.trim ()

		if (!firstCommitMsg) {
			return toTaskHref (this.name)
		}

		let titleWithHref = toTaskHref (firstCommitMsg)

		const BASH_ESCAPE_SINGLE_QUOTE = `'"'"'`
		return titleWithHref.split("'").join (BASH_ESCAPE_SINGLE_QUOTE)

	}

	async parentBranch () {
		let parent = await this.gitRepo.config (`branch.${this.name}.mr-target`)
		if (parent) {
			return GitBranch.withName (parent, this.gitRepo)
		}
		return (await this.gitRepo.defaultBranch ())
	}

	async isOriginGitlab () {
		if (this.isFuzz) {
			return true
		}
		let originUrl = await this.gitRepo.config (`remote.origin.url`)
		return originUrl.includes ('gitlab')
	}

	async print () {
		return `${this.origin}/${this.name}`
	}

	async current () {
		let currentBranch = await this.gitRepo.currentBranch ()
		return this.equals (currentBranch)
	}

	async equals (dst) {
		return await this.print () === await dst.print ()
	}

	async run (cmd) {
		return ShellCommand.withText(cmd).runSilent ()
	}
}
