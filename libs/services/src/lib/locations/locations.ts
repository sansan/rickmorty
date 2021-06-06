import { request, gql } from 'graphql-request';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

import { slugify } from '@rickmorty/utils';
import { API_ENDPOINT } from '@rickmorty/config';

import { GetLocationsResponse, Location, Character, Info } from './locations.d';

const getLocationFilter = ({ dimension, type }) => {
  if (!dimension && !type) {
    return '';
  }

  const filterProperties = [];

  if (dimension) {
    filterProperties.push(`dimension: "${dimension}"`);
  }

  if (type) {
    filterProperties.push(`type: "${type}"`);
  }

  return `filter: {${filterProperties.join(', ')}}`;
};

export const getLocations = async ({
  page = 1,
  dimension,
  type,
}: {
  page?: number;
  dimension?: string;
  type?: string;
}) => {
  const filter = getLocationFilter({ type, dimension });

  const response = await request<GetLocationsResponse>(
    API_ENDPOINT,
    gql`
      query {
        locations(page: ${page}, ${filter}) {
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

  return response;
};

export const getLocationById = async ({ id }: Pick<Location, 'id'>) => {
  const { location } = await request<{ location: Location }>(
    API_ENDPOINT,
    gql`
      query {
        location(id: ${id}) {
            id
            name
            type
            dimension
            residents {
              id
            }
        }
      }
    `
  );

  return location;
};

type PaginatedCharacters = Pick<Character, 'id' | 'name'> & {
  location: Pick<Location, 'id'>;
  origin: Pick<Location, 'id'>;
};

export const getCharacterPage = async ({
  pageNumber,
}: {
  pageNumber: number;
}) => {
  const response = await request<{
    characters: { results: PaginatedCharacters };
  }>(
    API_ENDPOINT,
    gql`
      query {
        characters(page: ${pageNumber}) {
          results {
            id
            name
            species
            type
            location {
              id
            }
            origin {
              id
            }
          }
        }
      }
    `
  );

  return response?.characters?.results || [];
};

export const getCharacterById = async ({ id }: Pick<Character, 'id'>) =>
  await request<Character>(
    API_ENDPOINT,
    gql`
      query {
        character(id: ${id}) {
            id
            name
            type
            dimension
        }
      }
    `
  );

export const getAllCharacters = async () => {
  const {
    characters: {
      info: { pages },
    },
  } = await request<{ characters: { info: { pages: number } } }>(
    API_ENDPOINT,
    gql`
      query {
        characters {
          info {
            pages
          }
        }
      }
    `
  );

  const results = await Promise.all(
    new Array(pages)
      .fill('')
      .map((_, index) => getCharacterPage({ pageNumber: index + 1 }))
  );

  return flatten(results) as PaginatedCharacters[];
};

const getLocationTypeAndDimension = async ({ pageNumber }) => {
  const response = await request<{
    locations: { results: Pick<Location, 'type' | 'dimension'> };
  }>(
    API_ENDPOINT,
    gql`
      query {
        locations(page: ${pageNumber}) {
          results {
            type
            dimension
          }
        }
      }
    `
  );

  return response?.locations?.results || [];
};

export const getAllLocationParams = async () => {
  const {
    locations: {
      info: { pages },
    },
  } = await request<{ locations: { info: Pick<Info, 'pages'> } }>(
    API_ENDPOINT,
    gql`
      query {
        locations {
          info {
            pages
          }
        }
      }
    `
  );

  const response = await Promise.all(
    new Array(pages)
      .fill('')
      .map((_, index) => getLocationTypeAndDimension({ pageNumber: index + 1 }))
  );

  const flatResults = flatten(response) as Pick<
    Location,
    'type' | 'dimension'
  >[];

  const types = uniq(flatResults.map(({ type }) => type))
    .sort()
    .map((value) => ({ name: value, slug: slugify(value) }));
  const dimensions = uniq(flatResults.map(({ dimension }) => dimension))
    .sort()
    .map((value) => ({ name: value, slug: slugify(value) }));

  return { types, dimensions };
};
