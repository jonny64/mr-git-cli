
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')

module.exports = class {
	async currentBranch () {
		let name = await this.run (`symbolic-ref --short HEAD`)
		return GitBranch.createByName (name, this)
	}

	async defaultBranch () {
		let [origin, name] = (await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)).split ('/')
		return GitBranch.createByName (`${origin}/${name}`, this)
	}

	async countDiffCommits (src, dst) {
		let srcName = await src.print ()
		let dstName = await dst.print ()
		let diff = await this.run (`log --oneline ${srcName}..${dstName}`)
		return diff.split (`\n`).filter (i => i).length
	}

	async existInRemote (src) {
		let {origin, name} = src
		let commitBranch = await this.run (`ls-remote --heads ${origin} ${name}`)
		return !!commitBranch
	}

	async run (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).runSilent ()
	}
}
