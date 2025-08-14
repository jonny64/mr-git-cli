module.exports = class {
	async todo () {
		if (!global.FUZZ) {
			console.log(`mr -h | --help              # this help message
mr                          # push current branch to its origin
mr TASK-42                  # switch to existing TASK-42 (create if needed)
mr TASK-42 from release     # create TASK-42 from release branch
mr TASK-42 to main          # merge TASK-42 into main
mr to main                  # merge current branch into main`)
		}
		return {todo: []}
	}
}
