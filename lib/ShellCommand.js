const { spawn } = require('child_process')

// @todo #0:30m decompose
// runSilent go to ShellCommand
// run go to ShellCommandLogged
module.exports = class ShellCommand {

	static withText (cmd) {
		return new ShellCommand ({ cmd, spawn })
	}

	constructor(o) {
		this.cwd = o.cwd
		this.cmd = o.cmd
		this.spawn = o.spawn
	}

	async run () {
		let cwdLabel = this.cwd ? ` (${this.cwd})` : ''
		this.log(`${cwdLabel} > ${await this.print ()}`)
		return this.runSilent({log_flow: true})
	}

	async runSilent (options = {}) {
		const {log_flow} = options
		if (global.FUZZ) {
			// @todo #120:1h move to injected ShellCommandFuzz
			return global.FUZZ_SHELL_REPLY
		}
		return new Promise((ok, fail) => {
			const cmd  = 'sh'
			const args = ['-c', this.cmd]

			const env = { ...process.env,
				TERM: 'xterm-256color'
			}
			const o = {env}
			const subprocess = this.spawn(cmd, args, o)

			let stdout = '', stderr = ''
			subprocess.stdout.on('data', (data) => {
				if (log_flow) process.stdout.write(data)
				stdout = stdout + data
			})

			subprocess.stderr.on('data', (data) => {
				if (log_flow) process.stdout.write(data)
				stderr = stderr + data
			})

			subprocess.on('exit', (code) => {
				if (code === 0) {
					ok(stdout.toString().trim())
				} else {
					fail(new Error(stderr.toString().trim()))
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
		console.log (label)
	}

}
