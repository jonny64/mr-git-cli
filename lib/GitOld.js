const ShellCommand    = require('./ShellCommand')

module.exports = class OldGit {

	constructor(o) {
		this.gitRepo = o.gitRepo
	}

	static isVersionAtLeast (version, minVersion) {
		const cleaned = version.trim()
		const [vMajor, vMinor] = cleaned.split('.').map(n => parseInt(n, 10))
		const [minMajor, minMinor] = minVersion.split('.').map(n => parseInt(n, 10))
		if (vMajor > minMajor) return true
		if (vMajor < minMajor) return false
		return vMinor >= minMinor
	}

	async translate (o) {
		if (!o.version) {
			let v = await ShellCommand.withText (`git --version`).runSilent ()
			o.version  = v.split ('git version')[1]
		}

		if (OldGit.isVersionAtLeast (o.version, '2.23')) {
			return o
		}

		let translated = []

		for (let i of o.todo) {
			translated = translated.concat (await this.translateCmd (i))
		}
		o.todo = translated

		return o
	}

	async translateCmd (cmd) {
		if (/^git switch --guess --merge --create/.test (cmd)) {
			return [
				cmd.split ('git switch --guess --merge --create').join ('git checkout -b'),
			]
		}

		if (/^git switch --guess --merge/.test (cmd)) {

			let result = [
				cmd.split ('git switch --guess --merge').join ('git checkout')
			]

			let isDirty = await this.gitRepo.run ('git diff-files || true')

			if (isDirty) {
				result = ['git stash'].concat (result).concat ('git stash pop -q || true')
			}

			return result
		}

		return [cmd]
	}
}
