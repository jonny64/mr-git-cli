const assert = require('node:assert/strict')
const { exec } = require('child_process')

// @todo #0:30m decompose
// runSilent go to ShellCommand
// run go to ShellCommandLogged
module.exports = class ShellCommand {

	static withGit (cmd) {
		return new ShellCommand ({ cmd: `git ${cmd}` })
	}

	static withText (cmd) {
		return new ShellCommand ({ cmd })
	}

	constructor(o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
		this.isFuzz = process.env.FUZZ_TIME
	}

	async run () {
		if (this.isFuzz) {
			assert.ok (this.cmd)
			assert.ok (/^git /.test (this.cmd))
			return ''
		}
		let cwdLabel = this.cwd ? ` (${this.cwd})` : ''
		this.log(`${cwdLabel} > ${this.cmd}`)
		let result = await this.runSilent()
		if (result) {
			this.log(result.trim ())
		}
		return result
	}

	async runSilent () {
		if (process.env.FUZZ_TIME) {
			return ''
		}
		return new Promise((resolve, reject) => {
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
