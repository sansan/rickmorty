import { request, gql } from 'graphql-request';
import flatten from 'lodash/flatten';
import chunk from 'lodash/chunk';

import { API_ENDPOINT } from '@rickmorty/config';

import { Location, Character } from './rickmorty.d';

type PaginatedCharacters = Omit<Character, 'episode' | 'created' | 'type' | 'location' | 'origin'> & {
  location: Pick<Location, 'id' | 'name'>;
  origin: Pick<Location, 'id' | 'name'>;
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
              status
              species
              gender
              image
              location {
                id
                name
              }
              origin {
                id
                name
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
  } = await request<{characters: { info: { pages: number } } }>(
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

  const pagesForRequest = chunk(
    new Array(pages).fill('').map((_, index) => index + 1),
    3
  );
  let results = [];

  for (let i = 0; i < pagesForRequest.length; i++) {
    const response = await Promise.all(
      pagesForRequest[i].map((pageNumber) => getCharacterPage({ pageNumber }))
    );

    results = [...results, ...flatten(response)];
  }

  return flatten(results) as PaginatedCharacters[];
};
