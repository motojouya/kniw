export type Confirm = (message: string) => boolean;
export const confirm: Confirm = message => window.confirm(message);

export type Notice = (message: string) => void;
export const notice: Notice = async message => window.alert(message);

export type Dialogue = {
  confirm: Confirm;
  notice: Notice;
};
export const dialogue: Dialogue = {
  confirm,
  notice,
};
