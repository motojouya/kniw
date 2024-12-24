import type { ReactNode } from "react";

import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';
import type { PartyRepository } from '@motojouya/kniw/src/store/party';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';

import { createContext, useContext } from "react";

export type IO = {
  dialogue: Dialogue;
  partyRepository: PartyRepository;
  battleRepository: BattleRepository;
};

const ContextIO = createContext<IO>(null);

export type UseIO = () => IO;
export const useIO: UseIO = () => {
  const io = useContext(ContextIO);
  if (!io) {
    throw new Error("no context");
  }
  return io
};

export const IOProvider: React.FC<{
  children: ReactNode;
  io: IO;
}> = ({ children, master }) => {
  return <ContextIO.Provider value={io}>{children}</ContextIO.Provider>;
};
