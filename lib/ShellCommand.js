const { exec } = require('child_process')

module.exports = class ShellCommand {
	constructor(o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
	}

	async run () {
		let cwdLabel = this.cwd ? ` (${this.cwd})` : ''
		console.log(`${cwdLabel} > ${this.cmd}`)
		let result = await this.runSilent()
		if (result) console.log(result.trim ())
		return result
	}

	async runSilent () {
		return new Promise((resolve, reject) => {
			// eslint-disable-next-line sonarjs/os-command
			exec(this.cmd, {cwd: this.cwd}, (error, stdout, stderr) => {
				if (error) {
					let label = error.message
					if (label && /^Command failed: /i.test (label) && stdout) {
						label = stdout
					}
					reject (new Error (label))
					return
				}
				if (stderr) {
					resolve(stderr)
					return
				}
				resolve (stdout.trim ())
			})
		})
	}
}
