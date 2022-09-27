import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { Flex } from '@chakra-ui/react';
import SideNav from './components/SideNav';
import MainContent from './components/MainContent';

// Refer to the host's IP to be available within the local network
const ENDPOINT =
  window.location.protocol + '//' + window.location.hostname + ':3001';

// initlize socket
const socket = io(ENDPOINT);

// rooms
const ROOMS = [
  { id: 'general', name: 'General' },
  { id: 'room1', name: 'Room 1' },
  { id: 'room2', name: 'Room 2' },
];

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

  const changeRoom = (room) => {
    const prevRoom = selectedRoom;
    setSelectedRoom(room);
    socket.emit('room change', { prevRoom, room });
  };

  return (
    <Flex>
      <SideNav
        rooms={ROOMS}
        selectedRoom={selectedRoom}
        changeRoom={changeRoom}
      />
      <MainContent
        notice={notice}
        userId={userId}
        selectedRoom={selectedRoom}
        postMessage={postMessage}
        receiveMessageList={receiveMessageList}
        setPostMessage={setPostMessage}
        onSubmit={onSubmit}
      />
    </Flex>
  );
};
