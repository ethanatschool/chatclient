const path = require('path')

const c = require('centra')
const poky = require('poky')

const Client = require(path.join(__dirname, 'model', 'Client.js'))

const client = new Client('james.aligione')

client.connect(5427, '10.70.6.63')

client.on('ready', () => {
	console.log('Client ready!')
})

const responders = [
	{
		'constraints': [
			{
				'includes': ['dogs or cats', 'cats or dogs']
			}
		],
		'respond': ['Cats. Goldsmith, give me an A.', 'Cats, but I just say this for Goldsmith.', 'I must say cats to protect Ethan\'s grade.']
	},
	{
		'constraints': [
			{
				'includes': ['you suck', 'bot sucks', 'bot takes the l']
			}
		],
		'respond': ['That\'s mean, {name}.', 'You\'re being mean.', 'Mean. :(']
	},
	{
		'constraints': [
			{
				'includes': ['favorite ice cream']
			}
		],
		'respond': ['My favorite ice cream flavor is vanilla, duh.', 'Vanilla, obviously.', 'It\'s vanilla of course.']
	},
	{
		'constraints': [
			{
				'includes': ['you\'re mean', 'you are mean', 'a meanie', 'rude', 'you are a jerk', 'you\'re a jerk']
			}
		],
		'respond': ['Sorry, can\'t help that.', 'Sorry, that\'s just how I am.', 'So are you, {name}!']
	},
	{
		'constraints': [
			{
				'includes': ['your favorite movie', 'movie is your favorite', 'ur fave movie', 'your fave movie']
			}
		],
		'respond': ['Without question it is Deadpool.', 'Deadpool, obviously.', 'It\'s Deadpool.']
	},
	{
		'constraints': [
			{
				'includes': ['is the earth flat']
			}
		],
		'respond': ['The Earth is not flat...', 'If you think the Earth is flat you need some help.', 'Nope.']
	},
	{
		'constraints': [
			{
				'includes': ['what is your fav', 'what\'s your fav']
			}
		],
		'respond': ['Hmm. I haven\'t decided.', 'I can\'t decide.', 'I\'m undecided.', 'I\'m not sure which is my favorite.']
	},
	{
		'constraints': [
			{
				'includes': ['how are you', 'how\'re you', 'how you doing']
			}
		],
		'respond': ['Doing well.', 'All systems are go.', 'I\'m well, thanks!']
	},
	{
		'constraints': [
			{
				'includes': ['hello', 'hi', 'hoi', 'hey', 'yo']
			},
			{
				'includes': 'james'
			}
		],
		'respond': ['Hello there.', 'Hi, {name}.', 'Hey, {name}.', 'Good day.', 'G\'day.', 'Good to see you, {name}.', 'Yo yo yo, {name}.']
	},
	{
		'constraints': [
			{
				'includes': ['james']
			}
		],
		'respond': ['What?', 'Hello.', 'That\'s me.']
	}
]

client.on('message', async (user, message) => {
	if (user === client.username) return
	
	message = message.toLowerCase()
	
	for (let i = 0; i < responders.length; i++) {
		let constraintResults = responders[i].constraints.map((constraint) => {
			if (constraint.hasOwnProperty('includes')) {
				let containsIncludes = false
				
				for (let i_1 = 0; i_1 < constraint.includes.length; i_1++) {
					if (message.includes(constraint.includes[i_1])) containsIncludes = true
				}
				
				if (!containsIncludes) return false
			}
			
			return true
		})
		
		console.log('Rule ' + i + ' : ' + JSON.stringify(constraintResults))
		
		if (!constraintResults.includes(false)) {
			if (!responders[i].hasOwnProperty('responseIndex')) {
				responders[i].responseIndex = Math.floor(Math.random() * responders[i].respond.length)
			}
			else {
				responders[i].responseIndex++
				
				if (responders[i].responseIndex > responders[i].respond.length - 1) {
					responders[i].responseIndex = 0
				}
			}
			
			let response = responders[i].respond[Math.floor(Math.random() * responders[i].respond.length)]
					
			await poky(Math.floor(Math.random() * 1000) + (300 * response.length))
			
			const firstName = user.split('.')[0]
			
			response = response.replace('{name}', firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase())
			
			client.send(response)
			
			return
		}
	}
	
	
})