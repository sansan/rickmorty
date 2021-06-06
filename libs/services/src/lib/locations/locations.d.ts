type Id = number;

export type Unwrap<T> =
	T extends Promise<infer U> ? U :
	T extends (...args: any) => Promise<infer U> ? U :
	T extends (...args: any) => infer U ? U :
	T

export type Info = {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export type Character = {
  id: Id;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location
  location: Location
  image: string;
  episode: Episode[];
  created: string;
}

export type Characters = {
  info: Info
  results: Character[]
}

export type Episode = {
  id: Id
  name: string;
  air_date: string;
  episode: string;
  characters: Character[];
  created: string;
}

export type Episodes = {
  info: Info
  results: [Episode]
}

export type FilterCharacter = {
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
}

export type FilterEpisode = {
  name: string;
  episode: string;
}

export type FilterLocation = {
  name: string;
  type: string;
  dimension: string;
}

export type Location = {
  id: Id
  name: string;
  type: string;
  dimension: string;
  resIdents: Character[];
  created: string;
}

export type Locations = {
  info: Info
  results: Location[]
}

export type GetLocationsResponse = {
  locations: {
    results: Pick<Location, 'id' | 'name' | 'type' | 'dimension'>[];
  }
}