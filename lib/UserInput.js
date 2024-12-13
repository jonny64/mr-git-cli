
const readline = require('readline')

// @todo #0:1h add tests
// @todo #0:1h press 'y' or 'n' without Enter should be sufficient
module.exports = class {
	constructor(o) {
		this.question = o.question
		this.isFuzz = o.isFuzz
	}

	async ask() {
		if (this.isFuzz) {
			return 'y'
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
		while (true) {
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
	}

	log (label) {
		// @todo #120:1h move all console.log to injected LogCommand
		if (this.isFuzz) {
			return ''
		}
		console.log (label)
	}
}
