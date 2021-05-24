# forodieciocho

Scrape +1X posts from forocoches

## How to run

First lets create a Docker network:

```sh
docker network create forodieciocho
```

Then we need redis:

```sh
docker run \
    --name forodieciocho-redis \
    --network forodieciocho \
    -v /path/data:/data \
    -d redis redis-server --appendonly yes
```

Then run:

```sh
docker run \
    --name forodieciocho-app \
    --network forodieciocho \
    --restart always \
    -e PORT=3000 \
    -e REDIS_HOST=forodieciocho-redis \
    -p 3000:3000 \
    victor141516/forodieciocho
```

Now you can access to [localhost:3000](http://localhost:3000) and check that there is nothing.\
Thats because you have to scrape with:

```sh
curl -XPOST http://localhost:3000/api/scrape
```