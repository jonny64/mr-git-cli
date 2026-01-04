class NodeVersion {
	constructor (engines, nodeVersion) {
		this.minMajor = parseInt(engines.node.split('>=')[1])
		this.major = parseInt(nodeVersion.split('.')[0])
		this.version = nodeVersion
	}

	isValid () {
		return this.major >= this.minMajor
	}

	toError () {
		return `Node.js ${this.minMajor}+ required (current: v${this.version})`
	}
}

module.exports = NodeVersion
