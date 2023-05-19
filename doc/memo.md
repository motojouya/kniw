ターン経過での回復やステータス回復のために、ターン経過という種類のTurnオブジェクトがいる。
バトルモジュールには、次の行動順を決める関数や、ターン経過の結果を返す関数、スキルの実行、スキルのdry runがいる。
スキルにも対象をフィルタリングする関数が必要

コマンドラインまで書ききって、スキルやabilityを2,3用意したらテスト書きたい。
unit testが動いたらコマンドラインから動かしていく感じで
でもcommanderとpromptsは実際に単独で動かして試したい。でないと後からでは切り分けが難しい


charactorのテストケースのために、equipmentを実装しておく必要がある

ability
  -> 1つあればいい
skill
  -> 2つあればいい
      toFieldとtoCharactorの2つ
      battleのtestで指定する必要がある
equipment
  それぞれ2つずつ。他と相性が悪いのといいやつ
  race
    -> 1つでもいいが
  element
    -> raceとok,ng
  armor
    -> elementとok,ng
  weapon
    -> armorとok,ng


体系的には
- element
  - 雷
  - 炎
  - 風
  - 水
  - 命
- weapon
  - 剣
  - 鎚
  - 槍
  - 弓
  - 杖
- armor
  - armor
  - ローブ
- race
  - 人間
    普通
    エレメント自由
  - リザードマン
    堅い
    炎のエレメントのみ
  - ウルフマン
    強い
    風のエレメントのみ
  - マーマン
    水をいける
    水のエレメントのみ
  - バードマン
    空を飛べる
    風のエレメントのみ
  - フェアリー
    魔法
    エレメント自由

先ず実装するのは
- race
  - human
  - wolfman
- element
  - fire
  - thunder
- armor
  - steel armor
  - fire robe
- weapon
  - light sword
  - fire wand
- skill
  - chop
  - drought -> 日照り
- ability
  - quick -> Ability#waitのテストのため

これくらいあればテストケースが書きやすいはず
あとはio関連のテストも先にできそう。そっち先かな。そして並行して上記の実装イメージを持つ

装備というか、人の属性は、`acquirement`にしたい。  
raceはそのまま  
element -> blessing祝福  
armor -> clothing衣服  

blessingは4種類  
sky空  
sea海  
earth大地  
mind心  

sky -> sea -> earth -> skyという力関係  
mindは力関係図にはいらないが、強くもない感じのイメージ

