const { exec } = require('child_process')

module.exports = class ShellCommand {
	constructor(o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
	}

	async run () {
		console.log(`> ${this.cmd}` + (this.cwd ? ` (${this.cwd})` : ''))
		let label = (this.cwd? `cd ${this.cwd} && `: '') + this.cmd
		console.time (label)
		let result = await this.runSilent()
		if (result) console.log(result.trim ())
		console.timeEnd (label)
		return result
	}

	async runSilent () {
		return new Promise((resolve, reject) => {
			exec(this.cmd, {cwd: this.cwd}, (error, stdout, stderr) => {
				if (error) {
					let label = error.message
					if (label && /^Command failed: /i.test (label) && stdout) {
						label = stdout
					}
					reject (label)
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
