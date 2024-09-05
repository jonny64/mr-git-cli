
const Git = require ('./Git')

module.exports = class MrCommand {
	constructor(o) {
		this.src = o.src
		this.dst = o.dst
		this.git = new Git ()
	}

	async run () {
		try {
			let {git} = this, currentBranch = await git.currentBranch ()
			if (this.src && !this.dst) {
				return await git.switch (this.src)
			}
			if (!this.src && !this.dst) {
				return await git.push (currentBranch)
			}
			return await git.push (currentBranch)
		} catch (x) {
			console.log (x)
			return '' + x
		}
	}
}
