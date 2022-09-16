import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

// Refer to the host's IP to be available within the local network
const ENDPOINT =
  window.location.protocol + '//' + window.location.hostname + ':3001';

// initlize socket
const socket = io(ENDPOINT);

const Container = styled.div`
  margin: 32px;
  border: #eee solid 1px;
  border-radius: 4px;
`;

const Title = styled.div`
  padding: 8px;
`;
const Header = styled.div`
  padding: 8px;
  border: #eee solid 1px;
  border-radius: 4px;
`;

const Select = styled.select`
  margin-left: 8px;
`;

const ChatArea = styled.div`
  padding: 8px;
  border-radius: 4px;
`;

const MessageList = styled.ul`
  list-style: none;
`;

const ChatMessage = styled.li`
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: solid 1px #eee;
`;

const FormContent = styled.div`
  padding: 8px;
  border: #eee solid 1px;
  border-radius: 4px;
`;

const Form = styled.form`
  display: flex;
  padding: 8px;
`;

const Input = styled.input`
  width: 100%;
`;

const Button = styled.button`
  margin-left: 8px;
`;

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
    <MessageList>
      {messageList.map((message, index) => (
        <ChatMessage key={index}>{message}</ChatMessage>
      ))}
    </MessageList>
  );

  return (
    <Container>
      <Title>
        <h1>socket-io-chat-sample-with-react</h1>
      </Title>
      <Header>
        <p>Your Id: {userId}</p>
        <p>
          Selected Room:
          <Select
            value={selectedRoom}
            onChange={({ target }) => changeRoom(target.value)}
          >
            <option value="general">general</option>
            <option value="room1">room1</option>
            <option value="room2">room2</option>
          </Select>
        </p>
        <p>Notice: {notice}</p>
      </Header>
      <ChatArea>
        {!!receiveMessageList.length ? (
          renderMessageList(receiveMessageList)
        ) : (
          <div style={{ padding: 20 }}>not message</div>
        )}
      </ChatArea>
      <FormContent>
        <Form>
          <Input
            type="text"
            value={postMessage}
            onChange={({ target }) => setPostMessage(target.value)}
          />
          <Button onClick={(e) => onSubmit(e)}>Send</Button>
        </Form>
      </FormContent>
    </Container>
  );
};
