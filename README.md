# Obstilidraw

docker-compose example

````yml
version: '3'
services:
  obstilidraw:
    image: docker.obstinate.fr/obstilidraw
    container_name: obstilidraw
    environment:
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres?schema=public
      - GOOGLE_CLIENT_ID=
      - GOOGLE_CLIENT_SECRET=
    ports:
      - 3000:3000
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres
    container_name: obstilidraw-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - obstilidraw:/var/lib/postgresql/data

volumes:
  obstilidraw:

```

TODO:

- base permission (accepted or not, admin ?)
- Share a draw with someone?
- Login page
- List page
- Edit page
- Add babel plugin
- Diapo de dessin
````
