
const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {
	constructor(o) {
		this.name = o.name
		this.origin = o.origin
		this.repo = o.repo
	}

	async push (src) {
		let {name} = this, opt = ''
		if (await this.isOriginGitlab ()) {
			let main = (await this.repo.defaultBranch ()).name
			opt = `-o merge_request.create -o merge_request.title='${src}' -o merge_request.target=${main}`
		}

		return this.run (`push origin ${name}:${name} ${opt}`)
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
