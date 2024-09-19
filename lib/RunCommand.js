
const ShellCommand = require ('./ShellCommand')
const UserInput = require ('./UserInput')

module.exports = class {
	constructor(o) {
		this.todo = o.todo
		this.fail  = o.fail || 'fast'
	}

	async run () {

		console.log (`\nOk, here is the plan:\n${this.todo.map (i => ` git ${i.todo}`).join ('\n')}\n`)

		if (this.todo.length > 2) {
			if (!await new UserInput (`Proceed [Y/n]?`).confirm ()) {
				return
			}
		}

		for (let i of this.todo) {
			if (i.confirm) {
				let ok = await new UserInput (i.confirm).confirm ()
				if (!ok) {
					continue
				}
			}

			try {
				await this.runShell (i.todo)
			} catch (x) {
				if (i.fail && i.fail.confirm && await new UserInput (i.fail.confirm).confirm ()) {
					await this.runShell (i.fail.todo)
				} else {
					throw x
				}
			}
		}
	}

	async runShell (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
