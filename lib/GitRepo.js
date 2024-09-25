
const ShellCommand = require ('./ShellCommand')
const GitBranch = require ('./GitBranch')

module.exports = class {

	async currentBranch () {
		let name = await this.run (`git symbolic-ref --short HEAD`)
		return GitBranch.withName (name, this)
	}

	async defaultBranch () {
		let [origin, name] = (await this.run (`git symbolic-ref refs/remotes/origin/HEAD --short`)).split ('/')
		return GitBranch.withName (`${origin}/${name}`, this)
	}

	async countDiffCommits (src, dst) {
		let srcName = await src.print ()
		let dstName = await dst.print ()
		let diff = await this.run (`git log --oneline ${dstName}..${srcName}`)
		return diff.split (`\n`).filter (i => i).length
	}

	async existInRemote (src) {
		let {origin, name} = src
		let commitBranch = await this.run (`git ls-remote --heads ${origin} ${name}`)
		return !!commitBranch
	}

	async existBranch (src) {
		let ok = await this.run (`git branch --list ${src.name}`)
		return !!ok
	}

	async toMergeAfter (branch) {
		let listComma = await this.run (`git config --default '' --get branch.${branch.name}.mr-merge-after`)
		let list = !listComma? [] : listComma.split (',')
		return list.map (i => GitBranch.withName (i, this))
	}

	async toTest () {
		let listComma = await this.run (`git config --default '' --get mr.test`)
		return !listComma? [] : listComma.split (',')
	}

	async run (cmd) {
		return ShellCommand.withText (cmd).runSilent ()
	}
}
