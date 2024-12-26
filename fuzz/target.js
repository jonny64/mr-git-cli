const {main} = require('../mr')

const rp_valid = [
    "usage:",
]

const fuzz = async function (buf) {
	const s = buf.toString('utf8')
	const splitIndex = 7
	const branch = s.slice(0, splitIndex)
	const release = s.slice(splitIndex, splitIndex * 2)
	const fuzz_load = s.slice(splitIndex * 2)
	global.FUZZ_LOAD_ASK = fuzz_load
	global.FUZZ_LOAD = fuzz_load
	try {
		await main ([branch, 'to', release])
	} catch (x) {
		for (let i of rp_valid) {
			if (x.message.indexOf(i) !== -1) return
		}
		throw x
	}
}

module.exports = {
	fuzz
}
