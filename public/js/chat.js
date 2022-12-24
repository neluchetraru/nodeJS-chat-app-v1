const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector("button")
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")
const $sideBar = document.querySelector(".chat__sidebar")

const username = getQueryVariable('username')
const room = getQueryVariable('room')

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    console.log(encodeURIComponent(window.location))
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

socket.on('message', options => {
    const {
        username,
        message
    } = options
    const html = '<div class="message"><p><span class="message__name">' + username + '</span></p><p>' + message + '</p></div>'
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = $messageFormInput.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delievered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return console.log("Geolocation not supported.")
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (message) => {
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', ({
    username,
    room
}), (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('locationMessage', (options) => {
    const {
        username,
        url
    } = options
    const html = '<div class="message"><p><span class="message__name">' + username + '</span></p><p><a href="' + url + '">Open Maps</a>'
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('roomData', ({room, users}) => {
    $sideBar.innerHTML=`<h3 class="list-title">Users</h3>`
    const roomTitleHTML = `<h2 class="room-title">${room}</h2>`
    let roomListHTML = `<ul class="users">`
    users.forEach(user => roomListHTML = `${roomListHTML}<li>${user.username}</li>`)
    roomListHTML += `</ul>`
    $sideBar.insertAdjacentHTML('afterbegin', roomTitleHTML)
    $sideBar.insertAdjacentHTML('beforeend',roomListHTML)
})