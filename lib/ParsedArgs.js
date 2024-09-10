module.exports = class {
	constructor(argv) {
		this.argv = argv
	}

	value() {
		const [a1, verb, a2] = this.argv

		if (a2 && !['from', 'to'].includes(verb)) {
			throw new Error (`usage: mr TASK-42 [from|to main]`)
		}

		if (!a1 && !a2) {
			return {src: '', dst: '', action: 'push'}
		}

		let [src, dst, action] = ['', a1, 'switch']

		switch (verb) {
			case 'from':
				src = a2
				dst = a1
				action = 'create'
				break;
			case 'to':
				src = a1
				dst = a2
				action = 'merge'
				break;
		}

		return {src, action, dst}
	}
}
