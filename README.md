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
