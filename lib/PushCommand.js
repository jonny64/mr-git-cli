module.exports = class {
	constructor(o) {
		this.gitRepo = o.gitRepo
	}

	async todo () {
		let currentBranch = await this.gitRepo.currentBranch ()

		let src = currentBranch.name, opt = ''

		if (await currentBranch.isOriginGitlab ()) {
			let main = (await this.gitRepo.defaultBranch ()).name
			opt = ` -o merge_request.create -o merge_request.title='${src}' -o merge_request.target=${main}`
		}

		return {
			todo: [
				{todo: `push origin ${src}:${src}${opt}`}
			]
		}
	}
}
