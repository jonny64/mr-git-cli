const ShellCommand    = require('./ShellCommand')

module.exports = class OldGit {

	async translate (o) {
		let v = await ShellCommand.withText (`git --version`).runSilent ()
		let version = v.split ('git version')[1]

		if (version > '2.23') {
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
			return [
				'git stash',
				cmd.split ('git switch --guess --merge').join ('git checkout'),
				'git stash pop -q'
			]
		}
		return [cmd]
	}
}
