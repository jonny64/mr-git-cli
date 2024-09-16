
const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {
	constructor(o) {
		this.name = o.name
		this.origin = o.origin
		this.repo = o.repo
	}

	async pushTodo () {
		let {name} = this, opt = await this.gitlabPushOptions ()

		return `push -u origin ${name}:${name}${opt}`
	}

	async gitlabPushOptions () {
		if (!await this.isOriginGitlab ()) {
			return ''
		}
		let parentBranch = await (await this.parentBranch ()).fullName ()
		let mrTitle = await this.mrTitle ()
		return ` -o merge_request.create -o merge_request.title='${mrTitle}' -o merge_request.target=${parentBranch}`
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

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
