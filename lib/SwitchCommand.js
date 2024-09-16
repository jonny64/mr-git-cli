module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let defaultBranch = await this.gitRepo.defaultBranch ()
		let {src, dst} = await this.parsedArgs.value ()
		src = src || await defaultBranch.fullName()
		return {
			todo: [
				{
					todo: `fetch`
				},
				{
					todo: `switch --merge --guess ${dst}`,
					fail: {
						todo: `switch --guess --merge --create ${dst} ${src}`,
						confirm: `Create new branch '${dst}' from '${src}' [Y/n]? `,
					}
				},
			]
		}
	}
}