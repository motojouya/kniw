
# 画面設計

## ツール
- next.js
- github pages
  - 別アカウント作ってそっちでやりたい
- UIライブラリ
  - material uiはややこしい感じがする
  - やることは単純なので凝ったことできなくていいし、テーマとかいらないが
- storage
  - indexed dbを使う  
  - file_repositoryもKVSな構造をしているので、自然と使えると思う
  - ライブラリはなんか探す

## dir

root
- index.tsx
- party
  - index.tsx
  - [name].tsx
  - new.tsx
- battle
  - index.tsx
  - [title].tsx

### index.tsx
- 軽い説明
- ソースリポジトリとその中の説明へのリンク
- party/index.tsxへのリンク
- battle/index.tsxへのリンク

### party/index.tsx
- 戻るリンク
  - index.tsxへ
- party/new.tsxへのリンク
- 各partyへのリンク(party/[name].tsx)

### party/new.tsx
- 戻るリンク
  - party/index.tsxへ
- form
  - name: text
  - hire: button
  - charactors: list
    - name: text
    - race: select
    - blessing: select
    - clothing: select
    - weapon: select
    - fire: button
    - statuses: view
  - submit: button

submitされるまで保存されない
保存するとparty/[name].tsxへ遷移する

### party/[name].tsx
- 戻るリンク
  - party/index.tsxへ
- form
  - name: view
  - hire: button
  - charactors: list
    - name: text
    - race: select
    - blessing: select
    - clothing: select
    - weapon: select
    - fire: button
    - statuses: view  
  - dismiss: button -> confirm modal  
  - export: button

party nameは変更できない
dismissするとparty/index.tsxに遷移する

### battle/index.tsx
- 戻るリンク
  - index.tsxへ
- battle start button  
  -> title, home, visitorの入力modal  
  -> battle/[title].tsxへの遷移(戦闘表示)  
- 各battleへのリンク(battle/[title].tsx)

### battle/[title].tsx
- 戻るリンク
  - battle/index.tsxへ

- 通常表示
  - title
  - home
  - visitor
  - result 
  - turns
    - turn
  - export: button
  - restart: button  
    -> 戦闘表示へ  
    - resultがon goingなもののみボタン表示

- 戦闘表示
  - コマンド選択
    - ターンのキャラ名表示
    - 降参: button  
      ->confirm  
      - header寄りに
    - 技選択
      - 画面のメイン
      - 技の後、被ダメキャラ選択(複数)
      - 効果表示
      - confirm  
        -> turn情報が保存され、次のturnへ。
    - キャラクター一覧
      - 常に下に表示されている
      - キャラクター詳細表示
        - 開閉するやつでいいかも

中断ボタンは不要。常に保存されているので、何もアクションいらないから
降参か、技選択による決着で、通常表示に遷移


