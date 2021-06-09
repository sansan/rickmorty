export type GetLocationsResponse = {
  locations: {
    info: Pick<Info, 'next' | 'pages'>;
    results: Pick<Location, 'id' | 'name' | 'type' | 'dimension'>[];
  };
};
