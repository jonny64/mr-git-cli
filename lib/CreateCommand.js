module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
		this.parsedArgs = o.parsedArgs
	}

	async todo () {
		let defaultBranch = await this.gitRepo.defaultBranch ()
		let {src, dst} = await this.parsedArgs.value ()
		src = src || await defaultBranch.print()

		return {
			confirmLabel: `Create new branch '${dst}' from '${src}' [Y/n]? `,
			todo: [
				`git fetch`,
				`git switch --guess --merge --create ${dst} ${src}`,
				`git config branch.${dst}.mr-target ${src}`,
			]
		}
	}
}
