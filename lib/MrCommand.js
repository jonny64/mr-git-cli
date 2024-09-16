module.exports = class MrCommand {
	constructor(o) {
		this.parsedArgs = o.parsedArgs
		this.gitRepo = o.gitRepo
		this.commands = o.commands
	}

	async todo () {
		let {gitRepo, parsedArgs} = this
		let args = await this.parsedArgs.value ()
		let clazz = this.commands [args.action]
		if (!clazz) {
			throw new Error (`unknown action: ${args.action}!`)
		}
		return new clazz ({parsedArgs, gitRepo}).todo()
	}
}
