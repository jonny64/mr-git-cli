
const ShellCommand = require ('./ShellCommand')
const UserInput = require ('./UserInput')

module.exports = class {
	constructor(o) {
		this.todo = o.todo
	}

	async confirm () {
		if (this.todo.length <= 2) {
			return
		}

		const todoLabel = this.todo.map (i => ` git ${i.todo}`).join ('\n')
		console.log (`\nOk, here is the plan:\n${todoLabel}\n`)

		if (!await new UserInput (`Proceed [Y/n]?`).confirm ()) {
			return
		}
	}

	async run () {

		await this.confirm ()

		for (let idx = 0; idx < this.todo.length; idx++) {
			let i = this.todo [idx]
			if (i.confirm) {
				let ok = await new UserInput (i.confirm).confirm ()
				if (!ok) {
					continue
				}
			}

			try {
				await this.runShell (i.todo)
			} catch (x) {
				await this.fallback (idx, x)
			}
		}
	}

	async fallback (idx, x) {
		let tail = this.todo.slice (idx + 1).map (i => ` git ${i.todo}`).join ('\n')
		let xx = x.message
		if (tail) {
			xx = xx + `\nFix above and then run rest of the plan:\n${tail}\n`
		}
		throw new Error (xx)
	}

	async runShell (cmd) {
		return (new ShellCommand({ cmd: `git ${cmd}` })).run ()
	}
}
