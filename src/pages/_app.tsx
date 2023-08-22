import { ChakraProvider } from '@chakra-ui/react'
import { FC, ReactNode } from 'react';

const MyApp = ({ Component, pageProps }: any) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
