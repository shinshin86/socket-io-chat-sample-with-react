import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

// Refer to the host's IP to be available within the local network
const ENDPOINT =
  window.location.protocol + '//' + window.location.hostname + ':3001';

// initlize socket
const socket = io(ENDPOINT);

export default () => {
  const [notice, setNotice] = useState('');
  const [userId, setUserId] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [receiveMessageList, setReceiveMessageList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('general');

  useEffect(() => {
    socket.on('welcome', (userId) => {
      setUserId(userId);
    });

    socket.on('notice', (notice) => {
      setNotice(notice);
    });
  }, []);

  useEffect(() => {
    socket.on('chat message', ({ message, userId }) => {
      const updatedMessageList = receiveMessageList.concat(
        `${message} (${userId})`
      );
      setReceiveMessageList(updatedMessageList);
    });
  }, [receiveMessageList]);

  const clearMessage = () => setPostMessage('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      socket.emit('chat message', { room: selectedRoom, message: postMessage });

      clearMessage();

      const updatedMessageList = receiveMessageList.concat(
        `${postMessage} (${socket.id})`
      );
      setReceiveMessageList(updatedMessageList);
    },
    [selectedRoom, postMessage, receiveMessageList]
  );

  const changeRoom = useCallback(
    (room) => {
      const prevRoom = selectedRoom;
      setSelectedRoom(room);

      socket.emit('room change', { prevRoom, room });
    },
    [selectedRoom]
  );

  const renderMessageList = (messageList) => (
    <ul>
      {messageList.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );

  return (
    <div>
      <div>
        <h1>socket-io-chat-sample-with-react</h1>
      </div>
      <div>
        <p>Your Id: {userId}</p>
        <p>
          Selected Room:
          <select
            value={selectedRoom}
            onChange={({ target }) => changeRoom(target.value)}
          >
            <option value="general">general</option>
            <option value="room1">room1</option>
            <option value="room2">room2</option>
          </select>
        </p>
        <p>Notice: {notice}</p>
      </div>
      <div>
        {!!receiveMessageList.length ? (
          renderMessageList(receiveMessageList)
        ) : (
          <div style={{ padding: 20 }}>not message</div>
        )}
      </div>
      <div>
        <form>
          <input
            type="text"
            value={postMessage}
            onChange={({ target }) => setPostMessage(target.value)}
          />
          <button onClick={(e) => onSubmit(e)}>Send</button>
        </form>
      </div>
    </div>
  );
};
