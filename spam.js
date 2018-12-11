const vm = require('vm')
const path = require('path')

const c = require('centra')
const ordin = require('ordin')

const Client = require(path.join(__dirname, 'model', 'Client.js'))

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const randomGen = (len) => {
	let gen = ''
	
	for (let i = 0; i < len; i++) {
		gen += alphabet[Math.floor(Math.random() * alphabet.length)]
	}
	
	return gen
}

const clients = []

for (let i = 0; i < 4; i++) {
	const client = new Client(randomGen(14))

	client.connect(5527, '10.70.6.151')
	
	client.on('ready', () => {
		clients.push(client)
		
		console.log('> Client ready: ' + client.username)
	})
}

setInterval(() => {
	const currentSend = randomGen(14)
	
	clients.forEach((client) => {
		client.send(currentSend)
	})
}, 400)