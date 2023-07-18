
# design doc

## 概要
コマンドラインでゲームができる。
ゲームは、Tactics Ogreをイメージしたもの。

盤面はレゴなどで作成し、盤面上の位置はこのアプリケーションでは管理しない。
以下を管理する。
- キャラクターのステータス
- 進行時のターン
- ゲームの完了条件

## 仕様
kniwコマンドに対して、以下のサブコマンドと、それぞれにアクションが存在する
- charactor
  - list
  - hire <name>
  - status <name>
  - change <name>
  - fire <name>
- party
  - list
  - build <name>
  - status <name>
  - change <name>
  - dismiss <name>
  - export <name>
- battle
  - histories
  - history <key>
  - export <key>
  - start <home-file-path> <visitor-file-path>
  - resume <log-path>
- ability
  - list
  - show <name>
- skill
  - list
  - show <name>
- race
  - list
  - show <name>
- blessing
  - list
  - show <name>
- clothing
  - list
  - show <name>
- weapon
  - list
  - show <name>

### charactor
戦闘に出すキャラクターを作るコマンド。
作ったキャラクターは、$USER_HOME以下にファイルとして保存され、コマンドで管理ができる。

制約としては、特定の$USER_HOME以下では、キャラクター名はユニークでなくてはならない。
また、キャラクターのstatusを変更する際は、そのキャラクターをふくむパーティに反映させるか否かを選ぶことができる。

キャラクターのステータスは、以下の4つを選択することで決まる。
ただし、種族やエレメントによっては装備できない武器や防具が存在する。
- 種族
- エレメント
- 武器
- 防具

### party
作ったキャラクターを集めてパーティを組むコマンド。
作ったパーティは、$USER_HOME以下にファイルとして保存され、コマンドで管理ができる。
またパーティをファイルに出力することもでき、出力したファイルがbattleコマンドのパラメータとなる。

パーティは6名-12名だが、8名が推奨。

### battle
作ったパーティを戦わせるコマンド。
partyコマンドで出力したファイルを2つ引数に取る。
また、過去の戦闘記録を参照することができる。

戦闘の流れは以下
1. ゲーム開始
2. 時間経過により、特定のキャラクターにターンが来る
3. そのキャラクターのアクションを行い、キャラクターあるいは場に対して影響を及ぼす
4. ターン終了
5. 2-4を繰り返し、どちらかが降参するか、全てのキャラクターのHPが0になったら決着する

ターン時に、対象キャラクターはアクションと、その影響を及ぼす対象を選択できる。
それ以外にも、以下のことを確認できる。
- 降参する
- 特定のキャラクターのステータス確認
- HPの一覧
- MPの一覧

## 使い方
ゲームは、事前にcharactorコマンド、partyコマンドを利用して、パーティを組んで、パーティファイルをexportしておく。
また、レゴなどを利用して、フィールドを組み上げておき、また動かすキャラクタの実体も用意する必要がある。

ゲームの進行は、battleコマンドで進行するが、フィールド上での位置はプレイヤーが動かす。
キャラクターによって移動には制約があるので、その制約についてはbattleコマンドから表示されている。

## 実装

### コマンドライン
commandersを利用して作る

### 対話型インタフェース
promptsを利用して作る

### ストレージ
$USER_HOME/.kniw以下に以下の構成で保存する。
- .kniw
  - charactor
    - name01.json
    - name02.json
  - paty
    - name01.json
    - name02.json
  - battle
    - datetime01.json
    - datetime02.json

それぞれのコマンドで、内容を参照できるが、ファイルはjsonでできている。

### データモデル

- action  
  名前はない  
  actor、乱数、対象を受け取って、対象の状態を変化させる関数

- skill  
  actorを受け取って、actorをbindしたactionの配列を返す関数が本体  
  property
  - name: string
  - wt: int
  - getActions: func

- ability  
  特定の能力のこと、itemを装備するとcharactorにつく  
  実装としてはnameのみで、abilityを考慮してどう実装するかはskill側が持つ

- item  
  種類
  - 武器
  - 防具
  - エレメント  
  property
  - skills
  - name
  - ability
  - parameter
    - 攻撃力
    - 防御力
    - hp
    - wt
  - limitation  
    何かと組み合わせることができないという制約

- charactor  
  実際に動かす人。マスタデータではなく、ユーザが作って来るが、制約もある。  
  property
  - name
  - skills  
    これはitemから移譲しているもの
  - abilities  
    これもitemから移譲しているもの
  - parameter
    - 攻撃力
    - 防御力
    - hp
    - wt  
    これもitemから移譲しているもの
  - 現在hp
  - 現在mp
  - status  
    状態異常など

- party
  property
  - name
  - charactors

- config  
  property
  - party人数
  - 乱数幅。ダメージ、命中
  - その他

### battle関数
ループしており、ループの中でキャラクターが順番に回ってくる。
ループの最後に、再度ループの順番を再計算し、次に動くキャラクターが決まる。

ターンが回ったきたキャラクターは、スキルを選択してアクションをお越し、キャラクターあるいは場に影響を及ぼす。
スキルの選択は対話型インタフェースにて

hpが0になったキャラクターはその場で倒れたままとなる。
すべてのキャラクターのhpが0になったら、負け。

スキルは、実際にアクションを起こすとどういう結果になるか期待値が表示される。
これはdryrun関数で実装される。
実際の実行はexecute関数。dryrunとexecuteの違いとしては
- dryrunはスキルから複数アクションが発生する場合は、一つだけの結果を表示
- dryrunは乱数が固定で、executeはダメージ乱数と命中乱数の2つを利用する。
- dryrun関数は、状態が書き換わったcharactorを表示はするが、実際には更新しない。

### validate関数
charactorを作る時、あるいはpartyを組む際に制約を実装するもの
itemが制約を持っているので、それを参照する。
また、globalなルールとして、party人数などを調整できる。
キャラクターづくり、パーティづくり、バトル開始時などに参照される

### その他
色つけなど、装飾は行いたい。
chalkなどのライブラリが使えそう。

## 計画

タスクを分けると
1. ストレージアクセス
  3days  
2. コマンドラインインタフェース  
  2.1. charactor  
    3days内部だけ  
  2.2. party  
    1days内部だけ  
  2.3. battle  
    1days内部だけ  
3. データモデルの大枠とサンプル実装
4. コマンド自体の実装。対話の流れも
5. 全てのデータモデルの実装  
  5.1. skills  
  5.2. items&ability  
  5.3. charactor&party&config  
6. もろもろ微調整
7. 最後のドキュメントまとめ  
  7.1. 使い方  
  7.2. レゴの組み方  
  7.3. gif動画  
  7.4. ポリシーやら開発の仕方やら  

それぞれで、新しく仕様が変わったらドキュメントに記載はしていきたい

ちょっと厳し目だが、項目一つにつき2日。1日1時間なので2時間で実装したい。
15*2=30日

