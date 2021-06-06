import React from 'react';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import difference from 'lodash/difference';

import {
  getLocations,
  getLocationById,
  getAllCharacters,
} from '@rickmorty/services';
import { slugify } from '@rickmorty/utils';

import { Seo } from '@rickmorty/ui/atoms';

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

  const residentIds = location.residents.map(({ id }) => id);
  const visitorIds = characters
    .filter(
      (character) =>
        character.location.id === location.id &&
        !residentIds.includes(character.id)
    )
    .map(({ id }) => id);

  const residentsUsaMethodology = characters.filter(
    ({ origin }) => origin.id === location.id
  ).length;

  const diff = difference(residentIds, visitorIds);

  return (
    <div>
      <Seo pageName={`Location: ${location.name}`} />
      <h3>{location.name}</h3>
      <ul>
        <li>Originally from loc: {residentsUsaMethodology}</li>
        <li>Vistors: {visitorIds.length}</li>
        <li>Residents: {residentIds.length}</li>
        <li>Diff {diff.length}</li>
      </ul>
    </div>
  );
};

export async function getStaticPaths() {
  const { locations } = await getLocations({ page: 1 });

  return {
    paths: locations.results.map(({ id, name }) => ({
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
