
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')

module.exports = class {
	async currentBranch () {
		let name = await this.run (`symbolic-ref --short HEAD`)
		return new GitBranch ({ name, origin: 'origin', repo: this })
	}

	async defaultBranch () {
		let [origin, name] = (await this.run (`symbolic-ref refs/remotes/origin/HEAD --short`)).split ('/')
		return new GitBranch ({ name, origin, repo: this })
	}

	async getBranch (fullName) {
		let [origin, name] = fullName.split ('/')
		if (!name) {
			name = origin
			origin = 'origin'
		}
		return new GitBranch ({ name, origin, repo: this })
	}

	async countDiffCommits (src, dst) {
		let srcName = await src.fullName ()
		let dstName = await dst.fullName ()
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
