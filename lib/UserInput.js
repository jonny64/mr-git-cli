
const readline = require('readline')

module.exports = class {
	constructor(o) {
		this.question = o.question
	}

	async ask() {
		if (global.FUZZ) {
			return global.FUZZ_USER_REPLY
		}
		const rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		})

		return await new Promise((resolve) => {
		  rl.question(`${this.question} `, (answer) => {
			rl.close()
			resolve(answer.trim().toLowerCase())
		  })
		})
	}

	async confirm() {
		let n = 0
		while (n++ < 3) {
		  const answer = await this.ask()

		  switch (answer) {
			case 'yes':
			case 'y':
			case '':
				return true
			case 'no':
			case 'n':
				return false
			default:
				this.log("Please answer 'y' or 'n', <Enter> for 'y'")
		  }
		}
		return false
	}

	log (label) {
		if (global.FUZZ) {
			return ''
		}
		console.log (label)
	}
}
