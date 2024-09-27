
const ShellCommand = require ('./ShellCommand')
const UserInput = require ('./UserInput')

module.exports = class {
	constructor(o) {
		// @todo #40:2h/ARC remove typeof
		this.todo = o.todo.map (i => (typeof i == "string"? {todo: i} : i))
	}

	async confirm () {
		if (this.todo.length <= 3) {
			return true
		}

		console.log (`\nOk, here is the plan:\n${await this.print ()}\n`)

		return new UserInput (`Proceed [Y/n]?`).confirm ()
	}

	async run () {

		if (!await this.confirm ()) {
			return
		}

		for (let idx = 0; idx < this.todo.length; idx++) {
			let i = this.todo [idx]

			if (i.confirm) {
				let ok = await new UserInput (i.confirm).confirm ()
				if (!ok) {
					throw new Error ('Aborted')
				}
			}

			let cmd = ShellCommand.withText (i.todo)

			try {
				await cmd.run ()
			} catch (x) {
				await this.fallback (idx, x)
			}
		}
	}

	async fallback (idx, x) {
		let tail = await this.print (idx)
		let xx = x.message
		if (tail) {
			xx = xx + `\nFix above and then run rest of the plan:\n${tail}\n`
		}
		throw new Error (xx)
	}

	async print (idx) {
		let tail = !idx? this.todo: this.todo.slice (idx + 1)
		return tail.map (i => `  ${i.todo}`).join ('\n')
	}
}
