module.exports = function (io, rooms) {
    var chatrooms = io.of('/roomlist').on('connection', function (socket) {
        console.log('Connection Established on Server!');
        socket.emit('roomupdate', JSON.stringify(rooms));

        socket.on('newroom', function (data) {
            console.log('New Room Created!');
            rooms.push(data);
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            socket.emit('roomupdate', JSON.stringify(rooms));
        })
    })
    var allData = [];
    var messages = io.of('/messages').on('connection', function (socket) {
        console.log('Connection Established on ChatRoom!');

        socket.on('joinroom', function (data) {
            console.log('%s Joined the Room', data.user);
            socket.username = data.user;
            socket.userPic = data.userPic;
            socket.join(data.room);
            io.of('/messages').in(data.room).clients((error, clients) => {
                if (error)
                    throw error;
                clients.map(function (client) {
                    var flag = 0;
                    allData.forEach(function (j) {
                        if (client === j.id)
                            flag = 1;
                    })
                    if (flag == 0) {
                        allData.push({
                            id: client,
                            name: data.user,
                            image: data.userPic
                        })
                    }
                })
            });
            updateUserList(data.room, true);
        })

        socket.on('newMessage', function (data) {
            socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
        })

        function updateUserList(room, updateAll) {
            var userlist = [];
            //console.log(allData);
            io.of('/messages').in(room).clients((error, clients) => {
                if (error)
                    throw error;
                clients.map(function (client) {
                    allData.map(function (item) {
                        if (item.id === client)
                            userlist.push({
                                name: item.name,
                                image: item.image
                            });
                    })
                })
                //console.log(userlist);
                socket.to(room).emit('updateUsersList', JSON.stringify(userlist));
                if (updateAll) {
                    socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userlist));
                }
            });
        }

        socket.on('updateList', function (data) {
            updateUserList(data.room, true);
        })
    })
}