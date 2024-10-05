const ShellCommand    = require('./ShellCommand')

module.exports = class OldGit {

	constructor(o) {
		this.gitRepo = o.gitRepo
	}

	async translate (o) {
		if (!o.version) {
			let v = await ShellCommand.withText (`git --version`).runSilent ()
			o.version  = v.split ('git version')[1]
		}

		if (o.version > '2.23') {
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
