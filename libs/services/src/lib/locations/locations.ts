/* eslint-disable-next-line */
export interface LocationsProps {}

export interface LocationsResponse {
  name: string;
}

export async function getLocations(props: LocationsProps): Promise<LocationsResponse> {
  return { name: 'as'};
}
