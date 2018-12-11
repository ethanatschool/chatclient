const path = require('path')
const util = require('util')
const ofs = require('fs')
const fs = {
	'readFile': util.promisify(ofs.readFile),
	'writeFile': util.promisify(ofs.writeFile)
}

const usersDir = path.join(__dirname, 'users')

const defaultData = () => {
	return {
		'created': new Date(),
		'balance': 0
	}
}

const createUser = async (username) => {
	const writeContent = defaultData()
	
	await fs.writeFile(path.join(usersDir, username), JSON.stringify(writeContent))
	
	return writeContent
}

module.exports = {
	'read': async (username) => {
		try {
			const content = (await fs.readFile(path.join(usersDir, username))).toString()
			
			return JSON.stringify(content)
		}
		catch (err) {
			return await createUser(username)
		}
	},
	'update': async (username, data) => {
		await fs.writeFile(path.join(usersDir, username), JSON.stringify(data))
	}
}