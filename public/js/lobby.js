const socket = io()
const $form = document.querySelector('.form--create_room')
const $formButton = document.querySelector('.form--create_room button')
const $formInputUserName = document.querySelector('.form--create_room input[name="username"]')
const $formInputRoomName = document.querySelector('.form--create_room input[name="room"]')
const $formDropdown = document.querySelector('.centered-form__dropdown')
const $formDropdownInputUserName = document.querySelector('.centered-form__dropdown input[name="username"]')
const $formDropdownRoomSelect = document.querySelector('#room-select')
const $formDropdownButton = document.querySelector('.centered-form__dropdown form button')

socket.on('lobbyConnect', (rooms) => {
    if (rooms.length){
        rooms.forEach((room) => {
            const html  = `<option value="${room}">${room}</option>`
            $formDropdownRoomSelect.insertAdjacentHTML('beforeend', html)
        })
        $formDropdownRoomSelect.disabled = false
    } else {
        const html = `<option>No rooms available, please create one</option>`
        $formDropdownRoomSelect.insertAdjacentHTML('beforeend',html)
        $formDropdownButton.disabled = true
        $formDropdownRoomSelect.disabled = true
    }
})


$formDropdownButton.disabled = true
$formButton.disabled = true


const dropDownButtonState = () => {
    // if($formDropdown.)
    if($formDropdownInputUserName.value !== '' && $formDropdownRoomSelect.getAttribute('disabled') !== ''){
        $formDropdownButton.disabled = false
    } else {
        $formDropdownButton.disabled = true
    }
}

$formDropdown.addEventListener('keyup', dropDownButtonState)



const buttonState = () => {
    if($formInputRoomName.value !== '' && $formInputUserName.value !== ''){
        $formButton.disabled = false
    } else {
        $formButton.disabled = true
    }
}


$form.addEventListener('keyup', buttonState)

$formDropdown.addEventListener('submit',(e) => {

})