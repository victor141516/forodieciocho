import * as redis from 'redis';
import { Post } from '../post';

export class Database {
  readonly redisClient: redis.RedisClient;

  constructor(options?: redis.ClientOpts) {
    this.redisClient = redis.createClient(options);
  }

  async get(key: string): Promise<Post> {
    return new Promise((res, rej) =>
      this.redisClient.get(key, (err, rep) => {
        if (err) rej(err);
        else {
          try {
            res(Post.parse(rep));
          } catch (error) {
            rej(error);
          }
        }
      })
    );
  }

  async set(key: string, val: Post): Promise<void> {
    return new Promise((res, rej) => {
      let serialized: string;
      try {
        serialized = val.serialize();
      } catch (error) {
        rej(error);
      }
      this.redisClient.set(key, serialized, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  async quit(): Promise<void> {
    return new Promise((res) => this.redisClient.quit(() => res()));
  }

  async chunk(from?: string): Promise<{ posts: Post[]; cursor: string }> {
    let cursor = from ?? '0';

    const reply = await new Promise((res, rej) =>
      this.redisClient.scan(cursor, 'MATCH', '*', 'COUNT', '10', (err, d) => {
        if (err) rej(err);
        else res(d);
      })
    );

    cursor = reply[0];
    return {
      posts: await Promise.all(reply[1].map((k) => this.get(k))),
      cursor,
    };
  }
}
