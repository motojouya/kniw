import type { Dialogue } from 'src/io/standard_dialogue';
import type { Repository } from 'src/io/file_repository';
import { NotApplicable } from 'src/io/standard_dialogue';
import { createStore } from 'src/store/charactor';
import { createRandoms } from 'src/domain/random';

const byebyeMessages = [
  '君とは馬が合わないと思っていたんだ',
  '俺のいなくなったパーティでせいぜい楽しくやればいいさ',
  '残念だ。目的を遂げるまで一緒に居られるとおもっていたのだが',
  'わ、私を捨てるのか',
  'あの時に交わした約束は嘘だったのだな',
];

export type Fire = (dialogue: Dialogue, repository: Repository) => (name: string) => Promise<void>;
export const fire: Fire = async (dialogue, repository) => name => {
  const store = createStore(repository);
  const confirmAnswer = await dialogue.confirm(`本当に${name}を解雇してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await store.remove(name);

  await dialogue.notice(`${name}を解雇しました。言伝を預かっております。`);
  const randoms = createRandoms();
  const message = byebyeMessages[Math.floor(randoms.accuracy * byebyeMessages.length)];
  await dialogue.notice(`「${message}」とのことです。`);
};


