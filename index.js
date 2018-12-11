const vm = require('vm')
const path = require('path')

const c = require('centra')
const ordin = require('ordin')

const userData = require(path.join(__dirname, 'userData.js'))

const Client = require(path.join(__dirname, 'model', 'Client.js'))

const client = new Client('HelpBot')

client.connect(5427, '10.70.6.66')

client.on('message', async (user, message) => {
	if (user === client.username) return
	
	const senderData = await userData.read(user)
	
	console.log('> ' + user + ' sent ' + message)
		
	if (message.indexOf('!') === 0) {
		const segments = message.substring(1).split(' ')
		const command = segments[0]
		
		if (command === 'help') {
			client.send('Commands:')
			client.send('!bname [name] - Bname-ify a name!')
			client.send('!blockmatrix - Get the top BlockMatrix players.')
		}
		else if (command === 'bal' || command === 'balance' || command === 'money') {
			client.send('Your balance: $' + senderData.balance)
		}
		else if (command === 'bname') {
			let names = segments.slice(1)
			
			if (names.length === 0 && user.includes('.')) {
				names = user.split('.')
			}
			
			const vowels = 'aeiou'.split('')
			
			const isVowel = (letter) => vowels.includes(letter)
			
			const removeStartConsonants = (word) => {
				while (!isVowel(word.charAt(0))) {
					word = word.slice(1)
				}
				
				return word
			}
			
			const bnames = names.map((name) => 'B' + removeStartConsonants(name).toLowerCase())
			
			client.send('Result: ' + bnames.join(' '))
		}
		else if (command === 'eval') {
			if (user === 'ethan.davis') {
				client.send(vm.runInNewContext(message.substring(6), {
					client
				}))
			}
			else {
				client.send('You don\'t have permission to do that.')
			}
		}
		else if (command === 'bm' || command === 'blockmatrix') {
			const res = await c('https://api.teamrhs.com/getHighScores', 'POST').send()
			
			const parsed = await res.json()
			
			for (let i = 0; i < 3; i++) {
				client.send(ordin(i + 1) + ' place is ' + parsed[i].name)
			}
		}
	}
})

client.on('ready', () => {
	console.log('> Client is ready.')
})

client.on('join', (user) => {
	if (user === client.username) return
	
	console.log('> ' + user + ' has joined')
})

client.on('leave', (user) => {
	if (user === client.username) return
	
	console.log('> ' + user + ' has left')
})