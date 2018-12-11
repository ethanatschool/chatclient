const path = require('path')

const c = require('centra')
const poky = require('poky')

const Client = require(path.join(__dirname, 'model', 'Client.js'))

const client = new Client('james.aligione')

client.connect(5427, '10.70.6.66')

client.on('ready', () => {
	console.log('Client ready!')
})

const responders = [
	{
		'constraints': {
			'includes': ['james']
		},
		'respond': ['What?', 'Hello.', 'That\'s me.']
	},
	{
		'constraints': {
			'includes': ['dogs or cats', 'cats or dogs']
		},
		'respond': ['Cats. Goldsmith, give me an A.', 'Cats, but I just say this for Goldsmith.', 'I must say cats to protect Ethan\'s grade.']
	},
	{
		'constraints': {
			'includes': ['you suck', 'bot sucks', 'bot takes the l']
		},
		'respond': ['That\'s mean, {name}.', 'You\'re being mean.', 'Mean. :(']
	},
	{
		'constraints': {
			'includes': ['favorite ice cream']
		},
		'respond': ['My favorite ice cream flavor is vanilla, duh.', 'Vanilla, obviously.', 'It\'s vanilla of course.']
	},
	{
		'constraints': {
			'includes': ['you\'re mean', 'you are mean', 'a meanie', 'rude', 'you are a jerk', 'you\'re a jerk']
		},
		'respond': ['Sorry, can\'t help that.', 'Sorry, that\'s just how I am.', 'So are you, {name}!']
	},
	{
		'constraints': {
			'includes': ['what is your fav', 'what\'s your fav']
		},
		'respond': ['Hmm. I haven\'t decided.', 'I can\'t decide.', 'I\'m undecided.', 'I\'m not sure which is my favorite.']
	},
	{
		'constraints': {
			'includes': ['how are you', 'how\'re you', 'how you doing']
		},
		'respond': ['Doing well.', 'All systems are go.', 'I\'m well, thanks!']
	},
	{
		'constraints': {
			'includes': ['hello', 'hi', 'hoi', 'hey', 'yo']
		},
		'respond': ['Hello there.', 'Hi, {name}.', 'Hey, {name}.', 'Good day.', 'G\'day.', 'Good to see you, {name}.', 'Yo yo yo, {name}.']
	}
]

client.on('message', async (user, message) => {
	if (user === client.username) return
	
	for (let i = 0; i < responders.length; i++) {
		if (responders[i].constraints.hasOwnProperty('includes')) {
			for (let i1 = 0; i1 < responders[i].constraints.includes.length; i1++) {
				if (message.toLowerCase().includes(responders[i].constraints.includes[i1])) {
					let response = responders[i].respond[Math.floor(Math.random() * responders[i].respond.length)]
					
					await poky(Math.floor(Math.random() * 1000) + (300 * response.length))
					
					const firstName = user.split('.')[0]
					
					response = response.replace('{name}', firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase())
					
					client.send(response)
					
					return
				}
			}
		}
	}
	
	
})