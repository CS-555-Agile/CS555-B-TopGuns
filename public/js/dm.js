
const socket = io(); 
socket.on('updateUserList', function(userList) {
    let loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    $('#user-list').html('<ul></ul>');
    userList.forEach(item => {
        if(loggedInUser.user_id != item.user_id){
            $('#user-list ul').append(`<li data-id="${item.user_id}" onclick="createRoom('${item.user_id}')">${item.user_name}</li>`)
        }
    });

});
socket.on('updateWindow', function(room) {
    const divElement = document.getElementById(''+room+'');
    if (divElement) {
      divElement.parentNode.removeChild(divElement);
    }
});
socket.on('openChatWindow', function(data) {
    // $('li[data-id='+data.userId+']').prop('onclick',null).off('click');
    // $('li[data-id='+data.withUserId+']').prop('onclick',null).off('click');

    // $('#after-login').append(`
    // <div class="chat-window" id="${data.room}">
    //     <div class="body"></div>
    //     <div class="footer">
    //         <input type="text" class="messageText"/><button onclick="sendMessage('${data. room}')">GO</button>
    //     </div>
    // </div>
    // `)
    openChatWindow(data);
    

});
socket.on('invite', function(data) {
    socket.emit("joinRoom",data)
});
socket.on('message', function(msg) {
    console.log("recieved")
    // If chat window not opened with this roomId, open it
    if(!$('#after-login').find(`#${msg.room}`).length) {
        openChatWindow(msg.room)
    }
    sendMyMessage(msg.room, msg.from, msg.message)
});
const login = (userId,name,category,subcategory) => {
                const user = {
                    "user_id" : userId,
                    "user_name" : name,
                    "category":category,
                    "subcategory":subcategory
                }
                sessionStorage.setItem('user', JSON.stringify(user));
                $('#me').html(`
                        <div class="me">
                            ${user.user_name}
                         </div>
                         `);
                socket.emit('loggedin', user);
                console.log(user)
            }
       
const sendMyMessage = (chatWidowId, fromUser, message) => {
    console.log("fired")
    let loggedInUser = JSON.parse(sessionStorage.getItem('user'))
    let meClass = loggedInUser.user_id == fromUser.user_id ? 'me' : '';

    $('#after-login').find(`#${chatWidowId} .body`).append(`
        <div class="chat-text ${meClass}">
            <div class="userPhoto">
                ${fromUser.user_name}
            </div>
            <div>
                <span class="message">${message}<span>
            </div>
        </div>
    `);
}

const sendMessage = (room) => {
    let loggedInUser = JSON.parse(sessionStorage.getItem('user'))
    let message = $('#'+room).find('.messageText').val();
    let val = {
        "room":{
            "room":room
        }
    }
    $('#'+room).find('.messageText').val('');
    socket.emit('message', {room: room, message:message, from: loggedInUser});
    socket.emit("joinRoom",val)
    sendMyMessage(room, loggedInUser, message)
}
const openChatWindow = (room) => {
    let loggedInUser = JSON.parse(sessionStorage.getItem('user'))
    if(loggedInUser.user_id===room.userId || loggedInUser.user_id===room.withUserId ) {
        $('li[data-id='+room.userId+']').prop('onclick',null).off('click');
        $('li[data-id='+room.withUserId+']').prop('onclick',null).off('click');
        $('#after-login').append(`
        <div class="chat-window" id="${room.room}">
            <div class="body"></div>
            <div class="footer">
                <input type="text" class="messageText"/><button onclick="sendMessage('${room.room}')">GO</button>
            </div>
        </div>
        `)
    }
}
const createRoom = (id) => {
    console.log("user1 , ",id);
    let loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    console.log("user2 , ",loggedInUser.user_id);
   
        room = Date.now() + Math.random();
         room = room.toString().replace(".","_");
         $('li[data-id='+id+']').prop('onclick',null).off('click');
        $('li[data-id='+loggedInUser.user_id+']').prop('onclick',null).off('click');
        socket.emit('create', {room: room, userId:loggedInUser.user_id, withUserId:id});
        // openChatWindow(room);
    
    
    
    

}

