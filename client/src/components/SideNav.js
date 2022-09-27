import { Flex, Text } from '@chakra-ui/react';
import { BsFillChatFill } from 'react-icons/bs';

const SideNav = ({ rooms, selectedRoom, changeRoom }) => {
  return (
    <Flex w="20%" direction="column" align="center" p={8}>
      <Flex
        h="20vh"
        direction="column"
        align="flex-start"
        justify="space-around"
      >
        {rooms.map((room, index) => {
          const backgroundColor = room.id === selectedRoom ? '#c1ddf6' : '';
          return (
            <Flex
              fontSize="xl"
              color="gray"
              align="center"
              backgroundColor={backgroundColor}
              key={index}
              padding="4"
            >
              <BsFillChatFill color="#3182ce" />
              <Text ml="2" onClick={() => changeRoom(room.id)}>
                {room.name}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default SideNav;
