const GitRepo = require('./GitRepo')
// @todo #0:30m move to lib/commands/Push, lib/commands/Switch, etc.
const Push    = require('./PushCommand')
const Create  = require('./CreateCommand')
const Switch  = require('./SwitchCommand')
const Merge   = require('./MergeCommand')

module.exports = class MrCommand {
	static withParsedArgs (parsedArgs) {
		const gitRepo = new GitRepo ()
		const createCommand = new Create  ({parsedArgs, gitRepo})
		const name2command = {
			Push,
			Switch,
			Create: Switch,
			Merge,
		}
		let commands = {}
		for (let [name, clazz] of Object.entries (name2command)) {
			commands [name] = new clazz ({parsedArgs, gitRepo, createCommand})
		}
		return new MrCommand({parsedArgs, gitRepo, commands})
	}

	constructor(o) {
		this.parsedArgs = o.parsedArgs
		this.gitRepo = o.gitRepo
		this.commands = o.commands
	}

	async todo () {
		let {gitRepo, parsedArgs, commands} = this
		let args = await parsedArgs.value ()
		let c = commands [args.action]
		if (!c) {
			throw new Error (`unknown action: ${args.action}!`)
		}
		return c.todo()
	}
}
