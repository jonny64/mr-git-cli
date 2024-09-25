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
	}

	async push () {
		for (let i of await this.pushTodo ()) {
			await this.run (i)
		}
	}

	async pushTodo (o = {}) {
		let {name} = this, opt = o.noMr? '' : await this.gitlabPushOptions ()

		let testCmd = await this.gitRepo.toTest ()

		return testCmd.concat (`git push --set-upstream ${this.origin} ${name}:${name}${opt}`)
	}

	async gitlabPushOptions () {
		if (!await this.isOriginGitlab ()) {
			return ''
		}
		let parentBranch = await this.parentBranch ()
		let mrTitle = await this.mrTitle ()
		return ` -o merge_request.create -o merge_request.title='${mrTitle}' -o merge_request.target=${parentBranch.name}`
	}

	async mrTitle () {
		let parentBranch = await (await this.parentBranch ()).print ()
		let firstCommitMsg = await this.run (`git log --reverse --pretty=format:%s ${parentBranch}..${this.name}`)
		return firstCommitMsg.split (`\n`).at (0).replace (/^(\d+)(\S+)?\s*/, 'TASK-$1 ')
	}

	async parentBranch () {
		return (await this.gitRepo.defaultBranch ())
	}

	async isOriginGitlab () {
		let originUrl = await this.run (`git config remote.origin.url`)
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
