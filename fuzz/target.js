const {main} = require('../mr')

const rp_valid = [
    "usage:",
]

const fuzz = async function (buf) {
	const s = buf.toString('utf8')
	const splitIndex = Math.floor(s.length / 2)
	const branch = s.slice(0, splitIndex)
	const release = s.slice(splitIndex)
	try {
		await main ([branch, 'to', release])
		await main ([branch, 'from', release])
		await main ([branch])
		await main ([release])
		await main ([s])
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
