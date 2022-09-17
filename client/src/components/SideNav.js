import { Flex, Text } from '@chakra-ui/react';
import { BsFillChatFill } from 'react-icons/bs';

const SideNav = ({ rooms, changeRoom }) => {
  return (
    <Flex w="20%" direction="column" align="center" p={8}>
      <Flex
        h="20vh"
        direction="column"
        align="flex-start"
        justify="space-around"
      >
        {rooms.map((room, index) => (
          <Flex fontSize="xl" color="gray" align="center" key={index}>
            <BsFillChatFill color="#3182ce" />
            <Text ml="2" onClick={() => changeRoom(room.id)}>
              {room.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default SideNav;
