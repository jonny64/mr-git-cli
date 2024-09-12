module.exports = class {
	constructor(o) {
		this.dst = o.dst
		this.src  = o.src
		this.gitRepo = o.gitRepo
	}

	async todo () {
		let defaultBranch = await this.gitRepo.defaultBranch ()
		let [src, dst] = [this.src || await defaultBranch.fullName(), this.dst]
		return {
			fail: 'fallback',
			todo: [
				{
					todo: `switch --merge --guess ${dst}`
				},
				{
					todo: `switch --guess --merge --create ${dst} ${src}`,
					confirm: `Create new branch '${dst}' from '${src}' [Y/n]? `,
				}
			]
		}
	}
}
