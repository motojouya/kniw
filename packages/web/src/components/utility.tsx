/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react';
import {
  Container as ChakraContainer,
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { IoIosArrowBack } from "react-icons/io";

const urlPrefix = import.meta.env.VITE_URL_PREFIX;

export type Transit = (path: string) => void;
export const transit: Transit = (path) => {

  let assignPath = path;
  if (urlPrefix) {
    assignPath = "/" + urlPrefix + path;
  }

  window.location.assign(assignPath);
};

export type GetSearchParams = () => URLSearchParams;
export const getSearchParams: GetSearchParams = () => new URLSearchParams(window.location.search);

export const Link: FC<{ href: string, line: boolean | null, children: ReactNode }> = ({ href, line, children }) => {

  let assignPath = href;
  if (urlPrefix) {
    assignPath = "/" + urlPrefix + href;
  }

  let variant = null;
  if (line) {
    variant = "underline";
  }

  return (<ChakraLink href={assignPath} variant={variant}>{children}</ChakraLink>);
};

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

// top 画面はあとリンクをちゃんとする感じかな
// ゲームの準備, ゲームの進行の文言はいらないか。単純に箇条書きのほうがいい
// 箇条書きではなく、ボタンが横に並んでるほうがいいんじゃないか。
// 説明へのリンクは上に移動する。
// ボタンを横に並べるのは、flexかな
// その前に、contents自体をflexで囲って中央にしないと。それかcenterタグでいけるか？centerだと上下も中央になっちゃうね

export const Container: FC<{ backLink: string | null; children: ReactNode; }> = ({ backLink, children }) => (
  <ChakraContainer>
    <Box>
      <Header backLink={backLink} />
      {children}
    </Box>
  </ChakraContainer>
);

export const Header: FC<{ backLink: string | null; }> = ({ backLink }) => {
  return (
      <Flex p="3" justify="flex-start">
        {backLink && (
          <Box p="1">
            <Icon fontSize="xl">
              <IoIosArrowBack />
            </Icon>
          </Box>
        )}
        <Box p="1">
          <Link href="/">
            <Heading>KNIW</Heading>
          </Link>
        </Box>
      </Flex>
  );
};

