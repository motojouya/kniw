
# システム設計

このページ自体不要かも。必要なら、もっと書くべきだし
これぐらいじゃないか
- commandはfile,webはindexed db
- プロジェクト構成

## プロジェクト構成
3つに分かれています。
- core
- command
- web

coreは共通モジュールで、webはgithub pageを作るため、commandはcliのためのものです。  

## tips
coreは主要なデータモデルがあり、またそれらを保存するinterfaceとしてstoreという機能を持ちます。  
ただ、store実態は、commandではローカルファイル、webではブラウザのIndexed DBとなるため、永続化実装を切り替えられる形となっています。  

webプロジェクトでは、react + vite + Material UIの構成ですが、永続化のためにIndexed DB実装のdexieを利用しています。  
commandは、永続化にファイルアクセスするだけなので、利用しているライブラリはcommanderやpromptといったコマンドを作るためのライブラリのみです。  

## WEB
WEB画面は、大きく以下の3つです。  
- root
- party
- battle

partyは以下の機能があります。
- 一覧
- 編集

battleは以下の機能があります。
- 一覧
- battle

Github Pagesの制約で動的pathは使えないので、特定のpartyやbattleを示す際は、query stringで指定されます。  

## Command
cliについては、[コマンドライン](/docs/play/how_to_use_command.md)に使い方の記述があります。  

