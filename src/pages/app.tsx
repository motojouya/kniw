import type { FC } from 'react';
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
          <a href="/party/">
            <Text>Partyの作成</Text>
          </a>
        </ListItem>
        <ListItem>
          <Text>ゲームの進行</Text>
          <a href="/battle/">
            <Text>Battleの管理</Text>
          </a>
        </ListItem>
      </UnorderedList>
      <Text>更に詳しい説明は<a href="https://github.com/motojouya/kniw">こちらのページ</a>を参照してください。</Text>
    </Box>
  </Box>
);
