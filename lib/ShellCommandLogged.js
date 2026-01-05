const { spawn } = require('child_process')

module.exports = class ShellCommandLogged {

	static withText (cmd) {
		return new ShellCommandLogged ({ cmd, spawn })
	}

	constructor (o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
		this.spawn = o.spawn
	}

	async run () {
		let cwdLabel = this.cwd ? ` (${this.cwd})` : ''
		this.log(`${cwdLabel} > ${await this.print()}`)

		if (global.FUZZ) {
			return global.FUZZ_SHELL_REPLY
		}

		return new Promise((ok, fail) => {
			const cmd = 'sh'
			const args = ['-c', this.cmd]
			const env = { ...process.env, TERM: 'xterm-256color' }
			const subprocess = this.spawn(cmd, args, { env })

			let stdout = '', stderr = ''

			subprocess.stdout.on('data', (data) => {
				process.stdout.write(data)
				stdout = stdout + data
			})

			subprocess.stderr.on('data', (data) => {
				process.stdout.write(data)
				stderr = stderr + data
			})

			subprocess.on('close', (code) => {
				if (code === 0) {
					ok(stdout.toString().trim())
				} else {
					const err = new Error(stderr.toString().trim())
					err.toString = function () { return '' }
					fail(err)
				}
			})

			subprocess.on('error', (error) => {
				fail(new Error(error.toString().trim()))
			})
		})
	}

	async print () {
		return this.cmd
	}

	log (label) {
		if (global.FUZZ) {
			return ''
		}
		console.log(label)
	}

}
