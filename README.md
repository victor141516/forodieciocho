# forodieciocho

Scrape +1X posts from forocoches

## How to run

First we need redis:

```sh
docker run \
    --name forodieciocho-redis \
    -v /path/data:/data \
    -d redis redis-server --appendonly yes
```

Then run:

```sh
docker run \
    --name forodieciocho-app \
    --restart always \
    -e PORT=3000 \
    -p 3000:3000
    victor141516/forodieciocho
```

Now you can access to [localhost:3000](http://localhost:3000) and check that there is nothing.\
Thats because you have to scrape with:

```sh
curl -XPOST http://localhost:3000/api/scrape
```