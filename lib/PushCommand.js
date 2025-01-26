const GitBranch = require ('./GitBranch')

module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let {gitRepo, parsedArgs} = this
		let {src} = await parsedArgs.value ()
		let srcBranch = await GitBranch.withName (src, this.gitRepo)

		return {
			todo: await srcBranch.pushTodo ()
		}
	}
}
