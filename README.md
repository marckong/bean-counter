<div align="center">
<img src="public/icon-192.png" width="200">
<h1><a target="_blank" href="https://bean-counter.r7.cx">Bean Counter</a></h1>

Demo Menu: [https://bean-counter.r7.cx/menu/Ozut_AvNR](https://bean-counter.r7.cx/menu/Ozut_AvNR)

## About

Bean Counter is a coffee menu and ordering application for private events.

</div>



### Running the app

#### Docker Compose

To run the application yourself, you can use Docker compose.

```yaml
services:
  app:
    image: ghcr.io/ryan-willis/bean-counter:latest
    ports:
      - "8080:8080"
    environment:
      PG_HOST: db
      ADMIN_PASSWORD: docker
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: bean
      POSTGRES_PASSWORD: counter
      POSTGRES_DB: beancounter
    ports:
      - "5432:5432"
```

### Environment Variables

- `PG_HOST` - The hostname of the PostgreSQL server.
- `PORT` - The port the application should listen on.

Then visit [http://localhost:8080/login/](http://localhost:8080/login/) and sign in with the default hardcoded password - "password".

## Local Development

To run the application in development mode locally, you will need to have a PostgreSQL server running. You can start one with Docker compose:

```bash
docker compose up -d db
```

Then you can install the dependencies with:

```bash
npm install
```

Then you can start the API server with:

```bash
npm run server
```

And finally, you can start the frontend with:

```bash
npm run dev
```

Then visit [http://localhost:8080/admin/](http://localhost:8080/admin/).

To generate Go functions to run postgres queries based on your .sql files:
```bash
npm run db:generate
```

To run database migrations:
```bash
npm run db:migrate
```

you can learn more about [https://sqlc.dev/](sqlc) and [https://github.com/pressly/goose](goose) at the links;
