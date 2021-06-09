import React from 'react';
import Link from 'next/link';

import { Button, Heading, Grid, GridItem } from '@chakra-ui/react';

import { slugify } from '@rickmorty/utils';

import { Card } from '@rickmorty/ui/molecules';

const LocationGrid = ({ hasNextPage, fetchNextPage, locations }) => {
  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
        {locations.map(({ id, name, type, dimension }) => (
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
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} colorScheme="blue">
          Load More
        </Button>
      )}
    </>
  );
};

export default LocationGrid;
