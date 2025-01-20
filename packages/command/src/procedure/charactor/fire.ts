import type { Dialogue } from "@motojouya/kniw/src/io/standard_dialogue";
import type { Database } from "@motojouya/kniw/src/io/database";
import { NotApplicable } from "@motojouya/kniw/src/io/standard_dialogue";
import { createRepository } from "@motojouya/kniw/src/store/charactor";
import { createRandoms } from "@motojouya/kniw/src/domain/random";

const byebyeMessages = [
  "君とは馬が合わないと思っていたんだ",
  "俺のいなくなったパーティでせいぜい楽しくやればいいさ",
  "残念だ。目的を遂げるまで一緒に居られるとおもっていたのだが",
  "わ、私を捨てるのか",
  "あの時に交わした約束は嘘だったのだな",
];

export type Fire = (dialogue: Dialogue, database: Database) => (name: string) => Promise<void>;
export const fire: Fire = (dialogue, database) => async (name) => {
  const repository = await createRepository(database);
  const confirmAnswer = await dialogue.confirm(`本当に${name}を解雇してもよろしいですか？`);
  if (!confirmAnswer || confirmAnswer instanceof NotApplicable) {
    return;
  }

  await repository.remove(name);

  await dialogue.notice(`${name}を解雇しました。言伝を預かっております。`);
  const randoms = createRandoms();
  const message = byebyeMessages[Math.floor(randoms.accuracy * byebyeMessages.length)];
  await dialogue.notice(`「${message}」とのことです。`);
};
