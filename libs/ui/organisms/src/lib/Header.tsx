import Link from 'next/link';
import { Box, HStack, Heading, Button } from '@chakra-ui/react';

export const Header = () => {
  return (
    <HStack
      alignContent="space-between"
      h="50px"
      w="100vw"
      bg="gray.900"
      px={4}
    >
      <Box cursor="pointer" mr={6} color="white">
        <Link href="/">
          <a>
            <Heading size="md">Rick & Morty</Heading>
          </a>
        </Link>
      </Box>
      <HStack>
        <Link href="/" passHref>
          <Button as="a" variant="link" minW="60px">Home</Button>
        </Link>
      </HStack>
    </HStack>
  );
};

export default Header;
