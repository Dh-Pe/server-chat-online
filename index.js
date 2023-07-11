const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 3001

io.on('connection', async socket => {
    socket.on('login', async userInfo => {
        socket.data.username = userInfo.username

        let response = await fetch('https://api-chat-online-request-dh-pe.vercel.app/user')
        let json = await response.json()
        let result = await json.find(result => result.username == userInfo.username && result.password == userInfo.password)
        let value = false

        console.log(result)
        if (result) value = true

        io.emit('authentication', value)
    })

    socket.on('registerUser', async userInfo => {
        socket.data.username = userInfo.username

        let response = await fetch('https://api-chat-online-request-dh-pe.vercel.app/user', {
            method: "post",
            body: JSON.stringify({
                name: userInfo.name,
                username: userInfo.username,
                password: userInfo.password,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                birth: userInfo.birth,
                groups: []
            }),
            headers: { "Content-Type": "application/json" },
        });

        let json = response.json()

        let value;
        if (json.message == "User was created") value = true
        else value = false

        io.emit('registeredUser', value)
    })

    socket.on('send_message', message => {
        io.emit('receive_message', {
            text: message,
            authorId: socket.id,
            author: socket.data.username
        })
    })
})

server.listen(PORT, () => console.log("Server is running..."))