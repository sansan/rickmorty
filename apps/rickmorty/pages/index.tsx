import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import flatten from 'lodash/flatten';

import { Box, Heading, HStack } from '@chakra-ui/react';

import {
  getLocations,
  Unwrap,
  getAllLocationParams,
  GetLocationsResponse,
} from '@rickmorty/services';
import { slugify, isOnServer } from '@rickmorty/utils';

import { Seo } from '@rickmorty/ui/atoms';
import { Filter } from '@rickmorty/ui/organisms';
import { Content } from '@rickmorty/ui/templates';

import LocationGrid from '../components/routes/home/LocationGrid';

export async function getStaticProps() {
  const [initialLocationData, params] = await Promise.all([
    getLocations({ page: 1 }),
    getAllLocationParams(),
  ]);

  return { props: { initialLocationData, params } };
}

export function Index({
  initialLocationData,
  params,
}: {
  initialLocationData: Unwrap<typeof getLocations>;
  params: Unwrap<typeof getAllLocationParams>;
}) {
  const router = useRouter();
  const onServer = isOnServer();

  const { dimension, type } = router.query;

  const selectedDimension = dimension
    ? params.dimensions.find(({ slug }) => slug === dimension)?.name
    : null;
  const selectedType = type
    ? params.types.find(({ slug }) => slug === type)?.name
    : null;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['locations', selectedDimension, selectedType],
    ({ pageParam = 0 }) => {
      console.log(pageParam);

      return getLocations({
        page: pageParam,
        dimension: selectedDimension,
        type: selectedType,
      });
    },
    {
      getNextPageParam: (lastPage) => {
        console.log({ next: lastPage.locations.info.next });
        return lastPage.locations.info.next;
      },
    }
  );

  if (!onServer && !data) {
    return null;
  }

  const locations = onServer
    ? initialLocationData.locations.results
    : flatten(data.pages.map((loc) => loc.locations.results));

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
        <LocationGrid
          hasNextPage={hasNextPage}
          locations={locations}
          fetchNextPage={fetchNextPage}
        />
      </Content.Full>
    </>
  );
}

export default Index;
