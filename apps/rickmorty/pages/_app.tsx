import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react';

import { Box } from '@chakra-ui/react'

const queryClient = new QueryClient()

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Box>Header</Box>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default CustomApp;
