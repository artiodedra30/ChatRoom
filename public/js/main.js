const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

//get username from URL
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true });

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
outputRoomName(room);
outputUsers(users);
});

socket.on('message', message => {
console.log(message);
outputMessage(message);

chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
 e.preventDefault();

 //Get message text
 const msg = e.target.elements.msg.value;

  if (!msg){
  return false ;
 }
 
 //Emit Massage to server 
 socket.emit('chatMessage', msg);

 e.target.elements.msg.value = '';
 e.target.elements.msg.focus();
});

function outputMessage(message) {
 const div = document.createElement('div');
 div.classList.add('message')
 div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
 <p class="text">
 ${message.text}
 </p> `;
 document.querySelector('.chat-messages').appendChild(div); 
}

//add room names to DOM
function outputRoomName(room) {
 roomName.innerText = room
}

// add users to DOM
function outputUsers(users){
 usersList.innerHTML = `
 ${users.map(user => `<li>${user.username}</li>`).join('')}
 `;
}

