# Books API

[![Build Status](https://travis-ci.org/javierlopeza/books-admin.svg?branch=master)](https://travis-ci.org/javierlopeza/books-admin)
[![Coverage Status](https://coveralls.io/repos/github/javierlopeza/books-admin/badge.svg?branch=master)](https://coveralls.io/github/javierlopeza/books-admin?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/0c0992a9d67e3663b55f/maintainability)](https://codeclimate.com/github/javierlopeza/books-admin/maintainability)

Restful API with NodeJS, Express, PostgreSQL, Sequelize, Travis, Mocha, Coveralls and Code Climate.

## Technologies, Frameworks, Tools and Packages

This repo will set you up with a simple restful API with:

- **NodeJS**: for writing Javascript server-side applications.
- **yarn**: fast, reliable and secure dependency management (you can use npm if you want).
- **Express**: a NodeJS framework.
- **PostgreSQL**: an open source object-relational database.
- **Sequelize**: an ORM (Object Relational Mapping) of PostreSQL.
- **Travis CI**: a continuous integration service for Testing Applications.
- **Coveralls**: a web service to help you track your code coverage over time.
- **Code Climate**: automated code review for maintainability.
- **Babel**: to convert ES6 Javascript code to ES5.
- **cookie-session**: a package to handle cookie-based session.
- **pkgcloud**: to store and serve files using the storage provider of your choice.
- **Heroku**: instructions to deploy and serve your API application.

## Requirements for your computer

- Install [Node.js](https://nodejs.org/en/download/)

```
brew install node
```

- Install [Yarn](https://legacy.yarnpkg.com/lang/en/docs/install/#mac-stable)

```
brew install yarn
```

- Install [PostgreSQL](https://www.postgresql.org/download/macosx/)

```
brew install postgresql
```

To start and stop `postgresql` just run:

```
brew services start postgresql
brew services stop postgresql
```

- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)

It works as a desktop app, so just start it and you'll see the whale icon on the top menu bar.

- Install [Minio]()

```
brew install minio
```

## Setup

- Clone this repo.

```
git clone https://github.com/javierlopeza/books-admin
cd books-admin
```

- Customize your new app information in `package.json`:

```
{
  "name": "books-admin",
  "version": "1.0.0",
  "description": "The coolest books admin app!",
  "author": "Javier Lopez <javierlopez@uc.cl>",
  ...
}
```

- Customize your new Heroku app information in `app.json`:

```
{
  "name": "Books Admin",
  ...
}
```

- Set your app's dev and test databases and containers names in `.env.development` and `.env.test`.

```
DB_NAME="books-admin_dev"
CONTAINER_NAME=booksdev
```

```
DB_NAME="books-admin_test"
CONTAINER_NAME=bookstest
```

We recommend using `<my_app_name>_dev` and `<my_app_name>_test` syntax.

- Install dependencies.

```
yarn
```

- Run `psql`.

```
brew services start postgresql
```

And create your development and test databases.

```
yarn db:setup
```

- Run Docker with Minio as your Cloud Storage service.

```
docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=MINIOACCESSKEY" -e "MINIO_SECRET_KEY=MINIOSECRETKEY" minio/minio server /data
```

Go to http://127.0.0.1:9000/ and create a new bucket called `books` for example.

## Run

```
yarn dev
```

## Test

```
yarn test
```

## FAQ

### **How to create a new model with routes**

- Generate model and migration files.

```
npx sequelize model:create --name Dog --attributes name:string,weight:integer
```

New model will be created at `/api/src/models/dog.js`

And new migration will be created at `/api/src/migrations/20200127054328-Dog.js`

- Create controller and routes files.

You can check how UserController is written for the controller.

And you may check how UserRoutes is built to define routes for the new model. Remember to include the base route in `/api/src/routes/index.js`