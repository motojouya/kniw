import { ChakraProvider } from '@chakra-ui/react'
// import { FC, ReactNode } from 'react';

// TODO 型ちゃんとつける
const MyApp = ({ Component, pageProps }: any) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
