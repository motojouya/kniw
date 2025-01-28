import type { FC } from 'react';
import {
  Box,
  List,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Link } from '../components/utility';

export const App: FC = () => (
  <Box p='10'>
    <Heading>KNIW</Heading>
    <Box>
      <Text>kniwは、Tactics Ogreを参考に作ったボードゲームです。</Text>
      <Text>このアプリケーションでは以下のことを行うことができます。</Text>
      <List.Root>
        <List.Item>
          <Text>ゲームの準備</Text>
          <Link href="/party/">
            <Text>Partyの作成</Text>
          </Link>
        </List.Item>
        <List.Item>
          <Text>ゲームの進行</Text>
          <Link href="/battle/">
            <Text>Battleの管理</Text>
          </Link>
        </List.Item>
      </List.Root>
      <Text>更に詳しい説明は<a href="https://github.com/motojouya/kniw">こちらのページ</a>を参照してください。</Text>
    </Box>
  </Box>
);
