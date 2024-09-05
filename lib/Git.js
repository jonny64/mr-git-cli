
const ShellCommand = require ('./ShellCommand')

module.exports = class Git {
	constructor() {
	}

	async switch (dst) {
		let result = ''
		try {
			result = await this.run (`switch --guess ${dst}`)
		} catch (x) {
			result = await this.run (`switch --guess --create ${dst}`)
		}
		return result
	}

	async push (src) {
		let main = await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)
		main = main.split ('origin/').join ('')
		let opt = `-o merge_request.create -o merge_request.title='${src}' -o merge_request.target=${main}`
		return this.run (`push origin ${src}:${src} ${opt}`)
	}

	async currentBranch () {
		return this.run (`symbolic-ref --short HEAD`)
	}

	async defaultBranch () {
		return this.run (`symbolic-ref --short HEAD`)
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
