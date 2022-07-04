import cors from 'cors';
import express from 'express';
import { JSDOM } from 'jsdom';

import { ChunkOpts, Database, Order } from './libs/database';
import { CATEGORY_REGEX, Post, PostCategory } from './libs/post';
import { Requester } from './libs/requester';

const PORT = process.env.PORT || 3001;
const db = new Database(process.env.MONGO_URL);
const requester = new Requester(process.env.REQUESTER_SESSION_ID);

let INDEX = '';
const BLACKLIST_POSTS = [
  'penya',
  'peña',
  'plataforma',
  'one piece al ritmo',
  'gifs de ostiones',
  'lla catalunlla, anime & manga',
  'conjunta de apuestas',
  'P ENYA',
];

const app = express();
app.use(cors());

app.post('/api/scrape', async (req, res) => {
  let fcPage: JSDOM;
  try {
    fcPage = await requester
      .get(
        `https://www.forocoches.com/foro/forumdisplay.php?f=2${
          req.query.page ? '&order=desc&page=' + req.query.page : ''
        }`
      )
      .then((r) => new JSDOM(r));
  } catch (error) {
    return res.send({ error: error!.toString() }).end();
  }

  const posts = Array.from(
    fcPage.window.document.querySelectorAll<HTMLLinkElement>(
      '#threadslist [id^=thread_title_]'
    )
  )
    .filter((e) => CATEGORY_REGEX.test(e.textContent!))
    .filter(
      (e) =>
        !BLACKLIST_POSTS.some((w) =>
          e.textContent!.toLocaleLowerCase().includes(w)
        )
    )
    .map(
      (e) =>
        new Post(
          e.href.split('t=')[1],
          e.textContent!,
          PostCategory[CATEGORY_REGEX.exec(e.textContent!)![0] as PostCategory]
        )
    );

  const count = (await Promise.all(posts.map((p) => db.insert(p)))).length;
  res.json({ count }).end();
});

app.get('/api/posts', async (req, res) => {
  const params = {} as ChunkOpts;
  if (req.query.from) params.from = Number.parseInt(req.query.from as string);
  if (req.query.search) params.titleContainsFilter = req.query.search as string;
  if (req.query.order) params.order = req.query.order as Order;
  if (req.query.limit)
    params.limit = Math.min(
      50,
      Number.parseInt(req.query.limit as string)
    ) as number;
  const { posts, cursor } = await db.chunk(params);
  res
    .json({
      posts: posts.map((p) => p.serialize()),
      cursor,
    })
    .end();
});

app.get('*', function (_, res) {
  res.sendFile(INDEX);
});

app.listen(PORT, function () {
  console.log('Server up and running on ', `http://localhost:${PORT}/`);
});

process.on('exit', () => db.quit());
