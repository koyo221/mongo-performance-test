mongodb + nodejsでパフォーマンスのテストをする

## Dockerを使用した実行環境のセットアップ

このプロジェクトでは、Dockerを使用してNode.jsとMongoDBの実行環境をセットアップします。

### 必要なツール

- Docker
- Docker Compose

### 手順

1. リポジトリをクローンします。

```sh
git clone https://github.com/koyo221/mongo-performance-test.git
cd mongo-performance-test
```

2. Dockerイメージをビルドします。

```sh
docker-compose build
```

3. Dockerコンテナを起動します。

```sh
docker-compose up
```

4. アプリケーションにアクセスします。

Node.jsアプリケーションは、`http://localhost:3000`でアクセスできます。
MongoDBは、`mongodb://localhost:27017`でアクセスできます。

### Dockerコマンド

- Dockerイメージのビルド: `docker-compose build`
- Dockerコンテナの起動: `docker-compose up`
- Dockerコンテナの停止: `docker-compose down`

## `app.js`の実行方法

このプロジェクトには、MongoDBに接続してランダムなドキュメントを挿入する`app.js`ファイルが含まれています。

### 手順

1. 必要な依存関係をインストールします。

```sh
npm install
```

2. `app.js`を実行します。

```sh
node app.js
```

`app.js`は、MongoDBに接続し、ランダムなドキュメントを`testdb`データベースの`testcollection`コレクションに挿入します。挿入されたドキュメントの`_id`がコンソールに表示されます。
