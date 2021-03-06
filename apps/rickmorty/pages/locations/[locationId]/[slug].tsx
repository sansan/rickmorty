import React from 'react';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import countBy from 'lodash/countBy';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Heading,
  HStack,
  List,
  ListItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { Content } from '@rickmorty/ui/templates';

import {
  getAllLocations,
  getLocationById,
  getAllCharacters,
} from '@rickmorty/services';
import { slugify } from '@rickmorty/utils';

import { Seo, Container } from '@rickmorty/ui/atoms';

import CharacterCard from '../../../components/routes/locations/CharacterCard';

const Location = ({ location }) => {
  const { data: characters } = useQuery(
    'charactersForLocations',
    getAllCharacters,
    {
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const residents = characters.filter(
    ({ origin }) => origin.id === location.id
  );

  const visitors = characters.filter(
    (character) =>
      character.location.id === location.id &&
      character.origin.id !== location.id
  );

  const stats = {
    residents: residents.length,
    status: countBy(residents, 'status'),
    species: countBy(residents, 'species'),
    gender: countBy(residents, 'gender'),
    visitors: visitors.length,
  };

  return (
    <Content.Full>
      <Seo pageName={`Location: ${location.name}`} />
      <Heading w="100%">{location.name}</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
        <GridItem>
          <Container px={4} minH="150px">
            <Heading size="sm" mb={2}>
              Residents by Status
            </Heading>
            <List>
              {Object.keys(stats.status).map((key) => (
                <ListItem>
                  <HStack justifyContent="space-between">
                    <Box>
                      {key.toLowerCase()}: {stats.status[key]}
                    </Box>
                    <Box>({(stats.status[key] / stats.residents) * 100}%)</Box>
                  </HStack>
                </ListItem>
              ))}
              <ListItem>Total: {stats.residents}</ListItem>
            </List>
          </Container>
        </GridItem>
        <GridItem>
          <Container px={4} minH="150px">
            <Heading size="sm" mb={2}>
              Residents by Species
            </Heading>
            <List>
              {Object.keys(stats.species).map((key) => (
                <ListItem>
                  <HStack justifyContent="space-between">
                    <Box>
                      {key.toLowerCase()}: {stats.species[key]}
                    </Box>
                    <Box>({(stats.species[key] / stats.residents) * 100}%)</Box>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Container>
        </GridItem>
      </Grid>

      <Heading w="100%">Residents</Heading>
      <Tabs w="100%">
        <TabList>
          <Tab>Residents ({stats.residents})</Tab>
          <Tab>Visitors: ({stats.visitors})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Alert status="info" mb={4}>
              <AlertIcon />
              <AlertTitle mr={2}>How are residents determined?</AlertTitle>
              <AlertDescription>
                According to some countries residents are always considered to
                be those who are originally from the location not considering
                where they are now.
              </AlertDescription>
            </Alert>
            <List w="100%" spacing={5}>
              {residents.map((resident) => (
                <CharacterCard character={resident} />
              ))}
            </List>
          </TabPanel>
          <TabPanel>
            <List w="100%" spacing={5}>
              {visitors.map((visitor) => (
                <CharacterCard character={visitor} isVisitor />
              ))}
            </List>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Content.Full>
  );
};

export async function getStaticPaths() {
  const locations = await getAllLocations();

  return {
    paths: locations.map(({ id, name }) => ({
      params: { locationId: id, slug: slugify(name) },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('charactersForLocations', getAllCharacters, {
    cacheTime: Infinity,
  });

  const location = await getLocationById({ id: params.locationId });

  return { props: { location, dehydratedState: dehydrate(queryClient) } };
}

export default Location;
