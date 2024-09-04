
const ShellCommand = require ('./ShellCommand')

module.exports = class MrCommand {
	constructor(o) {
		this.src = o.src
		this.dst = o.dst
	}

	async run () {
		try {
			if (this.src && !this.dst) {
				return await this.switch ()
			}
			if (!this.src && !this.dst) {
				return await this.push ()
			}
			return await this.push ()
		} catch (x) {
			console.log (x)
			return '' + x
		}
	}

	async switch () {
		let result = ''
		try {
			result = await this.git (`switch --guess ${this.src}`)
		} catch (x) {
			result = await this.git (`switch --guess --create ${this.src}`)
		}
		return result
	}

	async push () {
		let branch = await this.currentBranch ()
		let main = 'master'
		return this.git (`push origin ${branch}:${branch} -o merge_request.create -o merge_request.title='${branch}' -o merge_request.target=${main}`)
	}

	async currentBranch () {
		return this.git (`symbolic-ref --short HEAD`)
	}

	async defaultBranch () {
		return this.git (`symbolic-ref --short HEAD`)
	}

	async git (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
