import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ChakraProvider } from '@chakra-ui/react';

import { Header } from '@rickmorty/ui/organisms';
import { Content } from '@rickmorty/ui/templates';

function CustomApp({ Component, pageProps }: AppProps) {
  const queryClientRef = React.useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Rick & Morty</title>
      </Head>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Header />
          <Content>
            <Component {...pageProps} />
          </Content>
        </Hydrate>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default CustomApp;
