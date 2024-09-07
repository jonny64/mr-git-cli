
const ShellCommand = require ('./ShellCommand')

module.exports = class GitBranch {
	constructor(o) {
		this.name = o.name
		this.repo = o.repo
	}

	async push (src) {
		let {name} = this, opt = ''
		if (await this.is_origin_gitlab ()) {
			let main = await this.repo.defaultBranch ()
			opt = `-o merge_request.create -o merge_request.title='${src}' -o merge_request.target=${main}`
		}

		return this.run (`push origin ${name}:${name} ${opt}`)
	}

	async is_origin_gitlab () {
		return (await this.origin()).includes ('gitlab')
	}

	async origin () {
		return this.run (`config remote.origin.url`)
	}

	async defaultBranch () {
		return (await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)).split ('origin/').join ('')
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
