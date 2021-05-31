import React from 'react';
import { useQuery } from 'react-query';
import { request, gql } from 'graphql-request';
import uniqBy from 'lodash/uniqBy';
import Link from 'next/link';

import { Box } from '@chakra-ui/react';

const endpoint = 'https://rickandmortyapi.com/graphql';

const getLocations = async () => {
  const {
    locations: { results },
  } = await request(
    endpoint,
    gql`
      query {
        locations {
          results {
            id
            name
            type
            dimension
          }
        }
      }
    `
  );
  return results;
};

export async function getStaticProps() {
  const locations = await getLocations();
  console.log(locations);
  return { props: { locations } };
}

export function Index({ locations }) {
  const { data } = useQuery('locations', getLocations, {
    initialData: locations,
  });

  const dimensions = uniqBy(data, 'dimension').map(
    ({ dimension }) => dimension
  );

  const types = uniqBy(data, 'type').map(({ type }) => type);

  return (
    <Box bg="gray.600" w="100vw" h="100vh" overflowY="auto">
      {dimensions.map((dimension) => (
        <Box key={dimension}>{dimension}</Box>
      ))}
      {data.map((item) => (
        <Box key={item.id}>
          <Link href={`/locations/${item.id}`}>{item.name}
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export default Index;
