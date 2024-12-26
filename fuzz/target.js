const {main} = require('../mr')

const rp_valid = [
    "usage:",
]

const fuzz = async function (buf) {
	const s = buf.toString('utf8')
	const splitIndex = 10
	const branch = s.slice(0, splitIndex)
	const release = s.slice(splitIndex)
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
