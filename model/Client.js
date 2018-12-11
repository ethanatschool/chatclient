const net = require('net')
const EventEmitter = require('events')

const formatContent = (content) => {
	content += '\r\n'
	
	content = Buffer.from(content, 'utf8')
	
	const nullBuf = Buffer.from([0, content.length])
	
	return Buffer.concat([nullBuf, content])
}

const deformatContent = (content) => content.slice(2).toString()

module.exports = class Client extends EventEmitter {
	constructor (username) {
		super()
		
		this.username = username
		
		this.socket = null
		
		return this
	}
	
	connect (port, ip) {
		this.socket = net.createConnection(port, ip)
		
		this.socket.on('connect', () => {
			this.emit('ready')
			
			this.socket.write(formatContent(this.username))
		})
		
		this.socket.on('data', (data) => {
			data = deformatContent(data).replace(/\r|\n/g, '')
			
			if (data.indexOf('SERVER:') === 0) {
				if (data.includes('joined.')) {
					this.emit('join', data.split('ERVER: ')[1].split(' joined.')[0])
				}
				else if (data.includes('left.')) {
					this.emit('leave', data.split('ERVER: ')[1].split(' left.')[0])
				}
			}
			else if (data.includes(': ')) {
				this.emit('message', data.split(': ')[0], data.split(': ')[1])
			}
		})
		
		return this
	}
	
	send (message) {
		this.socket.write(formatContent(this.username + ': ' + message))
	}
	
	disconnect () {
		this.socket.end(() => {
			this.socket = null
		})
	}
}