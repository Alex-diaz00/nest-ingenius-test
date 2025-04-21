# 🛂 Nest.js backend app, Ingenius test

## Features

- Authentication using [Passport](https://www.passportjs.org/)
- [Local](https://www.passportjs.org/packages/passport-local/) and [JWT](https://www.passportjs.org/packages/passport-local/) strategies are implemented
- [TypeORM](https://typeorm.io/) to connect with PostgreSQL
- [ts-auto-mock](https://typescript-tdd.github.io/ts-auto-mock/) with [ttypescript](https://github.com/cevek/ttypescript) to generate mocks with jest
- Check code quality with [MegaLinter](https://oxsecurity.github.io/megalinter/latest/)
- Check continuous integration with [github actions](.github/workflows/unit-test.yml)
- Run the necessary services with [docker compose](https://docs.docker.com/compose/)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Alex-diaz00/nest-ingenius-test.git
```

Go to the project directory

```bash
  cd nest-ingenius-test
```

Install dependencies

```bash
  yarn
```

Create a `.env` from the example one and customize it with your [environment variables](#environment-variables)

```bash
  cp .env.example .env
```

Start the services using Docker Compose

```bash
  docker-compose up -d
```

Create the DB

```bash
  yarn db:create
```

Run migrations to create the DB schema

```bash
  yarn typeorm migration:run
```

Run seeders

```bash
  yarn db:seed
```

Start the server

```bash
  yarn start:dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`POSTGRES_DB` the name of the database to connect in the PostgreSQL instance **(required)**

`POSTGRES_USER` The name of the user to connect to the PostgreSQL instance **(required)**

`POSTGRES_PASSWORD` The password of the user to connect to the PostgreSQL instance **(required)**

`DATABASE_URL` a connection string to the PostgreSQL instance, example _postgres://postgres|@localhost/example-db_ **(required)**

`PORT` the port that Nest.js will listen at **(required)**

`APP_SECRET` the secret used to encrypt the session **(required)**

`ALLOWED_ORIGINS` a comma separated list of [origins](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) from which accept request **(required)**

You can copy the example `.env` and edit the values

```bash
  cp .env.example .env
```

## Running Tests

To run unit tests, run the following command:

```bash
  yarn test
```

To run e2e tests (the PostgreSQL instance must be available), run the following command:

```bash
  yarn test:e2e
```

To see the code coverage

```bash
  yarn test:cov
```

## Tech Stack

**Server:** Typescript, PostgreSQL, Nest.js, TypeORM, Passport

**Test:** Jest, SuperTest, TS auto mock

**DevOps:** Docker Compose

## Show your support

Give a ⭐️ if this project helped you!

## License

Release under the terms of [MIT](./LICENSE)
