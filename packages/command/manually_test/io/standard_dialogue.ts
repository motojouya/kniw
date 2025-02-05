import { textInput, confirm, message, clear, multiSelect, select } from "@motojouya/kniw/src/io/standard_dialogue";

const testTextInput = async () => {
  const r = await textInput("テキスト入力してください。");
  console.log(r);
};

const testConfirm = async () => {
  const r = await confirm("本当にいいんですか？");
  console.log(r);
};

const testMessage = async () => {
  await message("お伝えしたいことがあります");
};

const testClear = async () => {
  console.log("something");
  await clear();
  console.log("anything");
};

const testSelect = async () => {
  const r = await select("一つ選んでください", [
    { label: "はい", value: "yes" },
    { label: "いいえ", value: "no" },
    { label: "回答なし", value: "nothing" },
  ]);
  console.log(r);
};

const testSelectMany = async () => {
  const r = await select("一つ選んでください", [
    { label: "はい", value: "yes" },
    { label: "いいえ", value: "no" },
    { label: "回答なし", value: "nothing" },
    { label: "zero", value: "0" },
    { label: "one", value: "1" },
    { label: "two", value: "2" },
    { label: "three", value: "3" },
    { label: "four", value: "4" },
    { label: "five", value: "5" },
    { label: "six", value: "6" },
    { label: "seven", value: "7" },
    { label: "eight", value: "8" },
    { label: "nine", value: "9" },
  ]);
  console.log(r);
};

const testMultiSelect = async () => {
  const r = await multiSelect("三つ選んでください", 3, [
    { label: "はい", value: "yes" },
    { label: "いいえ", value: "no" },
    { label: "どちらでもない", value: "other" },
    { label: "両方", value: "both" },
    { label: "回答なし", value: "nothing" },
  ]);
  console.log(r);
};

const testMultiSelectOne = async () => {
  const r = await multiSelect("一つ選んでください", 1, [
    { label: "はい", value: "yes" },
    { label: "いいえ", value: "no" },
    { label: "どちらでもない", value: "other" },
    { label: "両方", value: "both" },
    { label: "回答なし", value: "nothing" },
  ]);
  console.log(r);
};

const testMultiSelectMany = async () => {
  const r = await multiSelect("三つ選んでください", 3, [
    { label: "はい", value: "yes" },
    { label: "いいえ", value: "no" },
    { label: "どちらでもない", value: "other" },
    { label: "両方", value: "both" },
    { label: "回答なし", value: "nothing" },
    { label: "zero", value: "0" },
    { label: "one", value: "1" },
    { label: "two", value: "2" },
    { label: "three", value: "3" },
    { label: "four", value: "4" },
    { label: "five", value: "5" },
    { label: "six", value: "6" },
    { label: "seven", value: "7" },
    { label: "eight", value: "8" },
    { label: "nine", value: "9" },
  ]);
  console.log(r);
};

const test = async () => {
  let breaking = false;
  while (true) {
    const r = await select("何をしますか？", [
      { label: "textInput", value: "t" },
      { label: "confirm", value: "c" },
      { label: "message", value: "m" },
      { label: "clear", value: "l" },
      { label: "multiSelect", value: "ms" },
      { label: "multiSelectOne", value: "mo" },
      { label: "multiSelectMany", value: "mm" },
      { label: "select", value: "se" },
      { label: "selectMany", value: "sm" },
      { label: "end", value: "e" },
    ]);
    console.log(r);

    switch (r) {
      case "t":
        await testTextInput();
        break;
      case "c":
        await testConfirm();
        break;
      case "m":
        await testMessage();
        break;
      case "l":
        await testClear();
        break;
      case "ms":
        await testMultiSelect();
        break;
      case "mo":
        await testMultiSelectOne();
        break;
      case "mm":
        await testMultiSelectMany();
        break;
      case "se":
        await testSelect();
        break;
      case "sm":
        await testSelectMany();
        break;
      case "e":
        breaking = true;
        break;
      default:
        break;
    }

    if (breaking) {
      break;
    }
  }
};

test();
