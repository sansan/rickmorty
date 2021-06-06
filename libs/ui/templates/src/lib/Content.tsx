import React from 'react';
import { VStack, Grid, GridItem } from '@chakra-ui/react';

export interface ContentProps {
  children?: React.ReactNode;
}

export const Content = ({ children, ...rest }: ContentProps) => {
  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      {...rest}
      gap={5}
      bg="gray.700"
      px={5}
      pt={5}
      h="calc(100vh - 50px)"
      w="100vw"
      overflowY="auto"
      color="white"
    >
      {children}
    </Grid>
  );
};

const SidebarLeft = ({ children }) => {
  return (
    <GridItem
      colSpan={{ base: 2, md: 4, lg: 3 }}
      display={{ base: 'none', md: 'block' }}
      pb={5}
    >
      <VStack spacing={5}>{children}</VStack>
    </GridItem>
  );
};

const Main = ({ children, ...rest }) => {
  return (
    <GridItem colSpan={{ base: 12, md: 8, lg: 6 }} pb={5} {...rest}>
      <VStack spacing={5}>{children}</VStack>
    </GridItem>
  );
};

const SidebarRight = ({ children }) => {
  return (
    <GridItem      
      colSpan={{ lg: 3 }}
      display={{ base: 'none', lg: 'block' }}
      pb={5}
    >
      <VStack spacing={5}>{children}</VStack>
    </GridItem>
  );
};

const Half = ({ children, ...rest }) => {
  return (
    <GridItem      
      colSpan={6}
      pb={5}
      {...rest}
    >
      <VStack spacing={5}>{children}</VStack>
    </GridItem>
  );
};

const Full = ({ children, ...rest }) => {
  return (
    <GridItem      
      colSpan={12}
      pb={5}
      {...rest}
    >
      <VStack spacing={5}>{children}</VStack>
    </GridItem>
  );
};

Content.Left = SidebarLeft;
Content.Main = Main;
Content.Right = SidebarRight;
Content.Half = Half;
Content.Full = Full;

