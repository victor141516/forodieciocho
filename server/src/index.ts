import * as path from 'path';

import cors from 'cors';
import express from 'express';
import { JSDOM } from 'jsdom';

import { Database } from './libs/database';
import { CATEGORY_REGEX, Post, PostCategory } from './libs/post';
import { Requester } from './libs/requester';

const PORT = process.env.PORT || 3000;
const db = new Database({ db: 2 });
const requester = new Requester(process.env.REQUESTER_SESSION_ID);

const STATIC = path.resolve(__dirname, 'static');
const INDEX = path.resolve(STATIC, 'index.html');
const app = express();
app.use(cors());

app.post('/api/scrape', async (req, res) => {
  const fcPage = await requester
    .get(
      `https://www.forocoches.com/foro/forumdisplay.php?f=2${
        req.query.page ? '&order=desc&page=' + req.query.page : ''
      }`
    )
    .then((r) => new JSDOM(r));

  const posts = Array.from(
    fcPage.window.document.querySelectorAll<HTMLLinkElement>(
      '#threadslist [id^=thread_title_]'
    )
  )
    .filter((e) => CATEGORY_REGEX.test(e.textContent))
    .map(
      (e) =>
        new Post(
          e.href.split('t=')[1],
          e.textContent,
          PostCategory[CATEGORY_REGEX.exec(e.textContent)[0]]
        )
    );

  const count = (await Promise.all(posts.map((p) => db.set(p.id, p)))).length;

  res.json({ count }).end();
});

app.get('/api/posts', async (req, res) => {
  const { posts, cursor } = await db.chunk(req.query.from as string);
  res
    .json({
      posts: posts.map((p) => JSON.parse(p.serialize())),
      cursor,
    })
    .end();
});

app.use(express.static(STATIC));

app.get('*', function (_, res) {
  res.sendFile(INDEX);
});

app.listen(PORT, function () {
  console.log('Server up and running on ', `http://localhost:${PORT}/`);
});

process.on('exit', () => db.quit());
