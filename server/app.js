const express = require('express');
const http = require('http');
const os = require('node:os');
const { Server } = require('socket.io');

/**
 * Get IPv4 of the host machine
 * @returns {string} - IPv4 string
 */
const getLocalIpv4 = () => {
  const netInfos = os.networkInterfaces();
  const en0 = netInfos['en0'];
  return en0.find(({ family }) => family === 'IPv4').address;
};

const host = getLocalIpv4();
const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

const origin = `http://${host}:3000`;
const io = new Server(server, {
  cors: {
    origin,
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  const startRoom = 'general';
  socket.join(startRoom, () => {
    const notice = `Join New User: ${socket.id}`;
    socket.broadcast.emit('notice', notice);
    socket.emit('welcome', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');

    const notice = `User leave: ${socket.id}`;
    socket.broadcast.emit('notice', notice);
  });

  socket.on('chat message', ({ room, message }) => {
    socket.to(room).emit('chat message', { message, userId: socket.id });
  });

  socket.on('room change', ({ prevRoom, room }) => {
    socket.leave(prevRoom, () => {
      io.to(prevRoom).emit('notice', `user ${socket.id} has left the room`);
      socket.join(room, () => {
        socket.to(room).emit('notice', `user ${socket.id} has join the room`);
      });
    });
  });
});

server.listen(port, () => console.log(`Use this URL: ${origin}`));
