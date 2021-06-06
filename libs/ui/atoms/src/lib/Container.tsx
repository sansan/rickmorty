import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const Container = ({ children, ...rest }: BoxProps) => (
  <Box borderRadius={7} bg="gray.600" w="full" pt={5} pb={5} {...rest}>
    {children}
  </Box>
);

export default Container;
