import { request, gql } from 'graphql-request';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import { slugify } from '@rickmorty/utils';
import { API_ENDPOINT } from '@rickmorty/config';

import { GetLocationsResponse } from './locations.d'
import {
  Location,
  FilterLocation,
  Info,
} from './rickmorty.d';

const getLocationFilter = (props: Partial<FilterLocation>) => {
  const filter = omitBy(props, isNil);

  if (isEmpty(filter)) {
    return '';
  }

  const filterProperties = Object.keys(filter).map(
    (key) => `${key}: "${filter[key]}"`
  );

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
          info{
            pages
            next
          }
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

export const getLocationPageCount = async () => {
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

  return pages;
};

export const getAllLocations = async (): Promise<Pick<Location, "id" | "name" | "dimension" | "type">[]> => {
  const pages = await getLocationPageCount();

  const response = await Promise.all(
    new Array(pages).fill('').map((_, i) => getLocations({ page: i + 1 }))
  );

  return flatten(response.map(( res ) => res.locations.results))
};

export const getAllLocationParams = async () => {
  const pages = await getLocationPageCount();

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
