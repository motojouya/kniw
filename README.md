# KNIW

A Board Game like "Tactics Ogre: Let Us Cling Together", computer SRPG game.

## design

### command
- check
  初期入力データのチェック
- start
  ゲームの開始

#### command action
- action
  技選択 -> ターゲット選択 -> 実行 -> ターンエンド
  勝敗が決まれば結果
  決まってなければ次のユニットを表示
- next
  actionを行わず次のユニットへ
- status
  - hp
  - mp
  - 順番
- parson
  人を選択
- quit
  ゲーム終了

### data
初期入力データ
こんな感じを想定
TypeScriptで型を定義したい

```
{
  "name": {
    "blessing": "",
    "race": "",
    "main_weapon": "",
    "sub_weapon": "",
    "armor": ""
  },
  ...
}
```

