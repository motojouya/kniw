FROM node:18

# アプリケーションディレクトリを作成する
WORKDIR /srv

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
# COPY package*.json ./

# RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
# COPY . .

# CMD [ "npm", "start" ]
