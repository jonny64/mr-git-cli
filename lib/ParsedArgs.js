module.exports = class {
	constructor(argv) {
		this.argv = argv
	}

	validateBranchName(name) {
		if (!name || typeof name !== 'string') {
			throw new Error('Branch name must be a non-empty string')
		}

		for (let i = 0; i < name.length; i++) {
			const char = name[i]
			const isValid = (char >= 'a' && char <= 'z') ||
							(char >= 'A' && char <= 'Z') ||
							(char >= '0' && char <= '9') ||
							char === '.' || char === '_' || char === '-' || char === '/'
			if (!isValid) {
				throw new Error(`Invalid branch name '${name}': contains forbidden characters`)
			}
		}

		if (name[0] === '/' || name[name.length - 1] === '/' || name[0] === '.') {
			throw new Error(`Invalid branch name '${name}': violates git ref format rules`)
		}

		if (name.includes('//') || name.includes('..') || name.endsWith('.lock')) {
			throw new Error(`Invalid branch name '${name}': violates git ref format rules`)
		}

		return name
	}

	value() {
		if (this.argv.includes('-h') || this.argv.includes('--help')) {
			return {action: 'Help'}
		}

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
			this.validateBranchName(verb)
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

		if (dst) this.validateBranchName(dst)
		if (src && src !== '__CURRENT_BRANCH__') this.validateBranchName(src)

		return {src, action, dst}
	}
}
