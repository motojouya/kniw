import type { FC, ReactNode } from 'react';

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

export const Link: FC<{ href: string, children: ReactNode }> = ({ href, children }) => {

  let assignPath = href;
  if (urlPrefix) {
    assignPath = "/" + urlPrefix + href;
  }

  retun (<a href={assignPath}>{children}</a>);
};
