import React from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Select,
  Heading,
  HStack,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import {
  getLocations,
  Unwrap,
  getAllLocationParams,
} from '@rickmorty/services';
import { slugify } from '@rickmorty/utils';

import { Seo } from '@rickmorty/ui/atoms';
import { Card } from '@rickmorty/ui/molecules';
import { Filter } from '@rickmorty/ui/organisms';
import { Content } from '@rickmorty/ui/templates';

export async function getStaticProps() {
  const [locations, params] = await Promise.all([
    getLocations({ page: 1 }),
    getAllLocationParams(),
  ]);

  return { props: { locations, params } };
}

export function Index({
  locations,
  params,
}: {
  locations: Unwrap<typeof getLocations>;
  params: Unwrap<typeof getAllLocationParams>;
}) {
  const router = useRouter();
  const { dimension, type } = router.query;
  const selectedDimension = dimension
    ? params.dimensions.find(({ slug }) => slug === dimension)?.name
    : null;
  const selectedType = type
    ? params.types.find(({ slug }) => slug === type)?.name
    : null;
  const { data, isError, isSuccess, isFetching } = useQuery(
    ['locations', selectedDimension, selectedType],
    () =>
      getLocations({
        page: 1,
        dimension: selectedDimension,
        type: selectedType,
      }),
    {
      initialData:
        selectedDimension || selectedType
          ? { locations: { results: [] } }
          : locations,
    }
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Seo pageName="Locations" />
      <Content.Full>
        <HStack justifyContent="space-between" w="100%">
          <Box>
            <Heading size="lg">Locations</Heading>
          </Box>

          <Filter dimensions={params.dimensions} types={params.types} />
        </HStack>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
          {isError && <Box>No results found</Box>}
          {isSuccess &&
            data.locations.results.map(({ id, name, type, dimension }) => (
              <GridItem key={id}>
                <Card>
                  <Card.Content>
                    <Heading size="md">{name}</Heading>
                    <Heading size="sm">{type}</Heading>
                    <Heading size="sm">{dimension}</Heading>
                  </Card.Content>
                  <Card.Actions>
                    <Link
                      href={{
                        pathname: '/locations/[id]/[slug]',
                        query: { id, slug: slugify(name) },
                      }}
                      passHref
                    >
                      <Button variant="link" colorScheme="pink" as="a">
                        Explore
                      </Button>
                    </Link>
                  </Card.Actions>
                </Card>
              </GridItem>
            ))}
        </Grid>
      </Content.Full>
    </>
  );
}

export default Index;
