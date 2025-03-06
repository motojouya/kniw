import type { FC } from 'react';
import {
  Box,
  List,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from '../components/utility';

export const App: FC = () => (
  <Box p='10'>
    <Header />
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
      <Text>遊び方やルールは<a href="https://github.com/motojouya/kniw">こちらのページ</a>を参照してください。</Text>
    </Box>
  </Box>
);

// containerはこんな感じ
// div(full width and flex center)
//   div container(max width 1024とか)
// そもそもcontainerがあるからそっちで行けそう
//
// top 画面はあとリンクをちゃんとする感じかな
// ゲームの準備, ゲームの進行の文言はいらないか。単純に箇条書きのほうがいい
// 箇条書きではなく、ボタンが横に並んでるほうがいいんじゃないか。
// 説明へのリンクは上に移動する。
// ボタンを横に並べるのは、flexかな
// その前に、contents自体をflexで囲って中央にしないと。それかcenterタグでいけるか？centerだと上下も中央になっちゃうね

export const Header: React.FC<{ backLink: string; }> = ({ backLink }) => {
  // header div(flex left align)
  //   icon link
  //   text link
  return (
      <header className="w-full max-w-5xl h-12 flex flex-nowrap justify-between items-center bg-white border-b">
        {backLink && (
          <div className="grow shrink m-2">
            <Icon fontSize="2xl" color="pink.700">
              <HiHeart />
            </Icon>
          </div>
        )}
        <div className="grow shrink m-2">
          <Link href="/">
            <Heading>KNIW</Heading>
          </Link>
        </div>
      </header>
  );
};

