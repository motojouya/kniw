import type { FC, ReactNode } from 'react';
import {
  Box,
  Flex,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Container, Link } from '../components/utility';

export const App: FC = () => (
  <Container>
    <Flex direction="column" justify="flex-start" align="center">
      <Text p="1">KNIWはタクティクスオウガを参考にしたボードゲームです。</Text>
      <Text p="1">遊び方やルールは<ChakraLink href="https://github.com/motojouya/kniw" variant="underline">こちらのページ</ChakraLink>を参照してください。</Text>
      <Flex p="1" justify="space-around" w="100%">
        <Box>
          <Link href="/party/" line>
            <Text>パーティの作成</Text>
          </Link>
        </Box>
        <Box>
          <Link href="/battle/" line>
            <Text>バトルの管理</Text>
          </Link>
        </Box>
      </Flex>
    </Flex>
  </Container>
);
