const GitRepo = require('./GitRepo')
const GitOld  = require('./GitOld')
// @todo #0:30m move to lib/commands/Push, lib/commands/Switch, etc.
const Push    = require('./PushCommand')
const Create  = require('./CreateCommand')
const Switch  = require('./SwitchCommand')
const Merge   = require('./MergeCommand')
const Help    = require('./HelpCommand')

module.exports = class MrCommand {
	static withParsedArgs (parsedArgs) {
		const gitRepo = new GitRepo ()
		const isFuzz = global.FUZZ
		const createCommand = new Create  ({parsedArgs, gitRepo})
		const name2command = {
			Push,
			Switch,
			Create: Switch,
			Merge,
			Help,
		}
		let commands = {}
		for (let [name, clazz] of Object.entries (name2command)) {
			commands [name] = new clazz ({parsedArgs, gitRepo, createCommand, isFuzz})
		}
		const gitOld = new GitOld ({gitRepo})
		return new MrCommand({parsedArgs, gitRepo, commands, gitOld, isFuzz})
	}

	constructor(o) {
		this.parsedArgs = o.parsedArgs
		this.gitRepo = o.gitRepo
		this.commands = o.commands
		this.gitOld = o.gitOld
		this.isFuzz = o.isFuzz
	}

	async todo () {
		let {gitOld, parsedArgs, commands} = this
		let args = await parsedArgs.value ()
		let c = commands [args.action]
		if (!c) {
			throw new Error (`unknown action: ${args.action}!`)
		}
		let todo = await c.todo ()
		return gitOld.translate (todo)
	}

}
