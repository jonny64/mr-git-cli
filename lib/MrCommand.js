const SwitchCommand = require ('./SwitchCommand')
const PushCommand = require ('./PushCommand')

module.exports = class MrCommand {
	constructor(parsedArgs, gitRepo) {
		this.parsedArgs = parsedArgs
		this.gitRepo = gitRepo
	}

	async todo () {
		let {gitRepo} = this
		let args = this.parsedArgs.value ()
		switch (args.action) {
			case 'push':
				return new PushCommand ({dst: args.dst, gitRepo}).todo ()
			case 'switch':
			case 'create':
				return new SwitchCommand ({dst: args.dst, gitRepo}).todo ()
			case 'merge':
				throw `merge not implemented (yet)!`
			default:
				throw new Error (`unknown action: ${args.action}!`)
		}
	}
}
