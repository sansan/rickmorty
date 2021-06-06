import React from 'react';
import { Image, ImageProps, HStack, Box } from '@chakra-ui/react';

import { Container } from '@rickmorty/ui/atoms';

export const Card = ({ children, ...rest }) => (
  <Container {...rest}>{children}</Container>
);

Card.Image = ({ src, alt }: Pick<ImageProps, 'src' | 'alt'>) => (
  <Image src={src} alt={alt} w="full" mb={5} />
);

Card.Content = ({ children }) => (
  <Box pl={5} pr={5} mb={5}>
    {children}
  </Box>
);

Card.Actions = ({ children, ...rest }) => (
  <HStack pl={5} pr={5} spacing={5} {...rest}>
    {children}
  </HStack>
);

Card.ActionsLeft = ({ children }) => <HStack mr="auto">{children}</HStack>;

Card.ActionsRight = ({ children }) => <HStack ml="auto">{children}</HStack>;

export default Card;
