
const ShellCommand = require ('./ShellCommand')

module.exports = class MrCommand {
	constructor(o) {
		this.src = o.src
		this.dst = o.dst
	}

	async run () {
		let result = ''
		try {
			result = (new ShellCommand({ cmd: `git switch --guess ${this.src}` })).run ()
		} catch (x) {
			result = (new ShellCommand({ cmd: `git switch --guess --create ${this.src}` })).run ()
		}
		return result
	}

}
