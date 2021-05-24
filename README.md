# forodieciocho

Scrape +1X posts from forocoches

## How to run

First lets create a Docker network:

```sh
docker network create forodieciocho
```

Then we need redis:

```sh
docker run -d \
    --name forodieciocho-redis \
    --network forodieciocho \
    -v /path/data:/data \
    -d redis redis-server --appendonly yes
```

Then we need [FlareSolverr](https://github.com/ngosang/FlareSolverr):

```sh
docker run -d \
    --name forodieciocho-flaresolverr \
    --network forodieciocho \
    -e LOG_LEVEL=info \
    --restart unless-stopped \
    ghcr.io/flaresolverr/flaresolverr:latest
```

Then run:

```sh
docker run -d \
    --name forodieciocho-app \
    --network forodieciocho \
    --restart always \
    -e PORT=3000 \
    -e REDIS_HOST=forodieciocho-redis \
    -e FLARESOLVERR_HOST=forodieciocho-flaresolverr \
    -p 3000:3000 \
    victor141516/forodieciocho
```

Now you can access to [localhost:3000](http://localhost:3000) and check that there is nothing.\
Thats because you have to scrape with:

```sh
curl -XPOST http://localhost:3000/api/scrape
```