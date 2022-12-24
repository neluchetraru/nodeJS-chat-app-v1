const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { getUser, addUser, removeUser, getUsersInRoom, getRooms } = require('./utils.js/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user} = addUser({ id:socket.id, username, room})
        console.log(room)
        if (error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', {username:"bot", message: "Welcome!"});
        socket.broadcast.to(user.room).emit('message', {username:"bot", message: `${user.username} has joined!`})
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback() 
    })

    socket.on('sendMessage',(message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed.')
        }

        io.to(user.room).emit('message', {username: user.username, message: message})


        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',{username:"bot", message: `${user.username} has left!`})
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (coords,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',{username: user.username, url:`https://google.com/maps?q=${coords.latitude},${coords.longitude}`})
        callback('Location shared')
    })
    
    socket.emit('lobbyConnect', getRooms())
})



server.listen(port, () => {
    console.log(`Server started on port ${port}!`)
})