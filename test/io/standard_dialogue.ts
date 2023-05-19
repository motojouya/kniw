import {
  textInput,
  confirm,
  message,
  clear,
  multiSelect,
  select,
} from 'src/io/standard_dialogue'


//TODO escape keyで結果にvalue propertyがない状態になるので、それを検知して何かしらしたい。
//例外ではないよな。単に結果なしなので、そういうハンドリングができる型に変えちゃうか
const test = async () => {
  try {
    const r = await multiSelect('選んでください', 3, [
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
      { label: 'c', value: 'c' },
      { label: 'd', value: 'd' },
      { label: 'e', value: 'e' },
      { label: 'f', value: 'f' },
      { label: 'g', value: 'g' },
      { label: 'h', value: 'h' },
      { label: 'i', value: 'i' },
      { label: 'j', value: 'j' },
      { label: 'k', value: 'k' },
      { label: 'l', value: 'l' },
      { label: 'm', value: 'm' },
      { label: 'n', value: 'n' },
    ]);
    const r = await textInput('なんでしょうか');
    const r = await confirm('ほんまのほんまに？');
    console.log('try ok', r);
  } catch (e) {
    console.log('catch ng', e);
  }
};

const testTextInput = async () => {
  const r = await textInput('テキスト入力してください。');
  console.log(r);
};

const testConfirm = async () => {
  const r = await confirm('本当にいいんですか？');
  console.log(r);
};

const testMessage = async () => {
  await message('お伝えしたいことがあります');
};

//TODO どういう機能で必要なのか否か
const testClear = async () => {
  console.log('something')
  await clear();
  console.log('anything');
};

const start = async () => {
  const r = await select('何をしますか？', [
    { label: 'textInput', value: 't' },
    { label: 'confirm', value: 'c' },
    { label: 'message', value: 'm' },
    { label: 'clear', value: 'l' },
    { label: 'multiSelect', value: 'ms' },
    { label: 'multiSelectOne', value: 'mo' },
    { label: 'multiSelectMany', value: 'mm' },
    { label: 'select', value: 's' },
    { label: 'end', value: 'e' },
  ]);

  switch (r) {
  case 't': 
    testTextInput();
    break;
  case 'c': 
    break;
  case 'm': 
    break;
  case 'l': 
    break;
  case 'ms': 
    break;
  case 'mo': 
    break;
  case 'mm': 
    break;
  case 's': 
    break;
  case 'e': 
    break;
  default:
    break;
  }
};


test();




