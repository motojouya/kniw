import type { FC } from 'react';
import Link from 'next/link';
import {
  Box,
  UnorderedList,
  ListItem,
  Heading,
  Text,
} from '@chakra-ui/react';

export const App: FC = () => (
  <Box p='10'>
    <Heading>KNIW</Heading>
    <Box>
      <Text>kniwは、Tactics Ogreを参考に作ったボードゲームです。</Text>
      <Text>このアプリケーションでは以下のことを行うことができます。</Text>
      <UnorderedList>
        <ListItem>
          <Text>ゲームの準備</Text>
          <Link href="/party">
            <Text>Partyの作成</Text>
          </Link>
        </ListItem>
        <ListItem>
          <Text>ゲームの進行</Text>
          <Link href="/battle">
            <Text>Battleの管理</Text>
          </Link>
        </ListItem>
      </UnorderedList>
      <Text>更に詳しい説明は<Link href="https://github.com/motojouya/kniw">こちらのページ</Link>を参照してください。</Text>
    </Box>
  </Box>
);
