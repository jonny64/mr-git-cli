const GitRepo = require ('./GitRepo')
const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {

	// @todo #0:30m rename to withName
	static withName (id, gitRepo = new GitRepo ()) {
		let [origin, name] = id.split ('/')
		if (!name) {
			name = origin
			origin = 'origin'
		}
		return new GitBranch ({ name, origin, gitRepo: gitRepo })
	}

	constructor(o) {
		this.name = o.name
		this.origin = o.origin
		this.gitRepo = o.gitRepo
	}

	async push () {
		return this.run (await this.pushTodo ())
	}

	async pushTodo () {
		let {name} = this, opt = await this.gitlabPushOptions ()

		return `push --set-upstream origin ${name}:${name}${opt}`
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
		let firstCommitMsg = await this.run (`log --reverse --pretty=format:%s ${parentBranch}..${this.name}`)
		let s = firstCommitMsg.split (`\n`).at (0).replace (/^(\d+)(\S+)?\s*/, 'TASK-$1 ')
		return s
	}

	async parentBranch () {
		return (await this.gitRepo.defaultBranch ())
	}

	async isOriginGitlab () {
		return (await this.originUrl()).includes ('gitlab')
	}

	async originUrl () {
		return this.run (`config remote.origin.url`)
	}

	async print () {
		return `${this.origin}/${this.name}`
	}


	async fetchOrigin () {
		await this.run (`fetch ${this.origin}`)
		return this
	}

	async equals (dst) {
		return await this.print () === await dst.print ()
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).runSilent ()
	}
}
