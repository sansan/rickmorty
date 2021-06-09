import React from 'react';
import { Box, Heading, HStack, List, ListItem, Avatar } from '@chakra-ui/react';

import { Container } from '@rickmorty/ui/atoms';

const CharacterCard = ({ character, isVisitor }) => {
  return (
    <Container px={5} key={character.id}>
      <ListItem>
        <HStack>
          <Avatar name={character.name} src={character.image} size="2xl" />
          <Box pl={5}>
            <Heading size="md">{character.name}</Heading>
            <List>
              <ListItem>Status: {character.status}</ListItem>
              <ListItem>Species: {character.species}</ListItem>
              <ListItem>Gender: {character.gender}</ListItem>
              {isVisitor && <ListItem>From: {character.origin.name}</ListItem>}

              {!isVisitor && <ListItem>Location: {character.location.name}</ListItem>}
            </List>
          </Box>
        </HStack>
      </ListItem>
    </Container>
  );
};

export default CharacterCard;
