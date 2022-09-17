import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';

const MainContent = ({
  notice,
  userId,
  selectedRoom,
  postMessage,
  receiveMessageList,
  setPostMessage,
  onSubmit,
}) => {
  return (
    <Box w="80%" p={8}>
      <Box>
        <Text fontSize={32}>socket-io-chat-sample-with-react</Text>
      </Box>
      <Box>
        <Text fontSize={16}>Your Id: {userId}</Text>
        <Text fontSize={16}>Selected Room: {selectedRoom}</Text>
        <Box p={4}>Notice: {notice}</Box>
      </Box>
      <Box>
        {receiveMessageList.length === 0 ? (
          <Box p={4}>not message</Box>
        ) : (
          receiveMessageList.map((msg, i) => (
            <Box p={4} key={i}>
              {msg}
            </Box>
          ))
        )}
      </Box>
      <Box>
        <FormControl>
          <FormLabel>Message</FormLabel>
          <Flex paddingLeft={4} paddingRight={4}>
            <Input
              type="text"
              value={postMessage}
              onChange={({ target }) => setPostMessage(target.value)}
            />
            <Button colorScheme="blue" onClick={(e) => onSubmit(e)}>
              Send
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MainContent;
