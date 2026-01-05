
const ShellCommandLogged = require ('./ShellCommandLogged')
const UserInput = require ('./UserInput')

module.exports = class {
	constructor(o) {
		this.todo = o.todo
		this.confirmLabel = o.confirmLabel
	}

	async confirm () {
		if (this.todo.length <= 4 && !this.confirmLabel) {
			return true
		}

		const question = [
			'',
			'Ok, here is the plan:',
			await this.print (),
			this.confirmLabel || `Proceed [Y/n]?`
		].join (`\n`)

		return new UserInput ({question}).confirm ()
	}

	async run () {

		if (!await this.confirm ()) {
			return
		}

		for (let idx = 0; idx < this.todo.length; idx++) {
			let i = this.todo [idx]

			let cmd = ShellCommandLogged.withText (i)

			try {
				await cmd.run ()
			} catch (x) {
				await this.fallback (idx, x)
			}
		}
	}

	async fallback (idx, x) {
		let tail = await this.print (idx)
		if (tail) {
			x.message = x.message + `\nFix above and then run rest of the plan:\n${tail}\n`
		}
		throw x
	}

	async print (idx) {
		let tail = !idx? this.todo: this.todo.slice (idx + 1)
		return tail.map (i => `  ${i}`).join ('\n')
	}
}
