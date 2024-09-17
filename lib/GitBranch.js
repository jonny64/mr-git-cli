
const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {
	constructor(o) {
		this.name = o.name
		this.origin = o.origin
		this.repo = o.repo
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
		let parentBranch = await (await this.parentBranch ()).fullName ()
		let firstCommitMsg = await this.run (`log --pretty=format:%s ${parentBranch}...${this.name}`)
		let s = firstCommitMsg.replace (/^(\d+)(\S+)?\s*/, 'TASK-$1 ')
		return s
	}

	async parentBranch () {
		return (await this.repo.defaultBranch ())
	}

	async isOriginGitlab () {
		return (await this.originUrl()).includes ('gitlab')
	}

	async originUrl () {
		return this.run (`config remote.origin.url`)
	}

	async fullName () {
		return `${this.origin}/${this.name}`
	}


	async fetchOrigin () {
		await this.run (`fetch ${this.origin}`)
		return this
	}

	async equals (dst) {
		return await this.fullName () === await dst.fullName ()
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).runSilent ()
	}
}
