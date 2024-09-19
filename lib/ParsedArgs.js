module.exports = class {
	constructor(argv) {
		this.argv = argv
	}

	value() {
		const [a1, verb, a2] = this.argv
		const usage = `usage: mr TASK-42 [from|to main]`

		if (verb && !['from', 'to'].includes(verb)) {
			throw new Error (usage)
		}

		if (['from', 'to'].includes(verb) && !a2) {
			throw new Error (usage)
		}

		if (!a1 && !a2) {
			return {src: '', dst: '', action: 'Push'}
		}

		let [src, dst, action] = ['', a1, 'Switch']

		switch (verb) {
			case 'from':
				src = a2
				dst = a1
				action = 'Create'
				break;
			case 'to':
				src = a1
				dst = a2
				action = 'Merge'
				break;
		}

		return {src, action, dst}
	}
}
