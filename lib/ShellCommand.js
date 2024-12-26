const assert = require('node:assert/strict')
const { exec } = require('child_process')

// @todo #0:30m decompose
// runSilent go to ShellCommand
// run go to ShellCommandLogged
module.exports = class ShellCommand {

	static withText (cmd) {
		return new ShellCommand ({ cmd, exec })
	}

	constructor(o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
		this.isFuzz = o.isFuzz || process.env.FUZZ_TIME
		this.exec = o.exec
	}

	async run () {
		let cwdLabel = this.cwd ? ` (${this.cwd})` : ''
		this.log(`${cwdLabel} > ${this.print ()}`)
		let result = await this.runSilent()
		if (result) {
			this.log(result.trim ())
		}
		return result
	}

	async runSilent () {
		if (this.isFuzz) {
			assert.ok (this.cmd)
			assert.ok (/^git /.test (this.cmd))
			return ''
		}
		return new Promise((resolve, reject) => {
			this.exec(this.cmd, {cwd: this.cwd}, (error, stdout, stderr) => {
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


	async print () {
		return this.cmd
	}

	log (label) {
		if (this.isFuzz) {
			return ''
		}
		console.log (label)
	}

}
