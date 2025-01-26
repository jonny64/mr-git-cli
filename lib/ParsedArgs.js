module.exports = class {
	constructor(argv) {
		this.argv = argv
	}

	value() {
		const [branch, verb, src_or_dst] = this.argv
		const usage = `usage: mr TASK-42 [from|to main]`

		if (verb && !['from', 'to'].includes(verb) && !['to'].includes(branch)) {
			throw new Error (usage)
		}

		if (['from', 'to'].includes(verb) && !src_or_dst) {
			throw new Error (usage)
		}

		if (!branch && !src_or_dst) {
			return {src: '__CURRENT_BRANCH__', dst: '', action: 'Push'}
		}

		if (['to'].includes(branch) && verb && !src_or_dst) {
			return {src: '__CURRENT_BRANCH__', dst: verb, action: 'Merge'}
		}

		let [src, dst, action] = ['', branch, 'Switch']

		switch (verb) {
			case 'from':
				src = src_or_dst
				dst = branch
				action = 'Create'
				break;
			case 'to':
				src = branch
				dst = src_or_dst
				action = 'Merge'
				break;
		}

		return {src, action, dst}
	}
}
