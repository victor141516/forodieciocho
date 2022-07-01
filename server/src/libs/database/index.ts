import { Collection, MongoClient } from 'mongodb';

import { Post, PostCategory } from '../post';

export type Order = 'a' | 'd';
export interface ChunkOpts {
  from?: number;
  limit?: number;
  categoryFilter?: PostCategory;
  titleContainsFilter?: string;
  order?: Order;
}

function regexEscape(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export class Database {
  private readonly client: MongoClient;
  private readonly collection: Promise<Collection>;

  constructor(mongoUrl?: string) {
    this.client = new MongoClient(mongoUrl || 'mongodb://localhost:27017');

    this.collection = new Promise((res, rej) => {
      this.client.connect((err) => {
        if (err) rej(err);
        else res(this.client.db('forodieciocho').collection('forodieciocho'));
      });
    });
  }

  async insert(post: Post): Promise<void> {
    const serializedPost = post.serialize();
    const { createdAt, ...set } = serializedPost;
    const setOnInsert = { createdAt };
    return new Promise(async (resolve, reject) =>
      (await this.collection).updateOne(
        { id: post.id },
        { $set: set, $setOnInsert: setOnInsert },
        { upsert: true },
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      )
    );
  }

  async quit(): Promise<void> {
    return this.client.close();
  }

  async chunk({
    from = 0,
    limit = 10,
    categoryFilter = undefined,
    titleContainsFilter = undefined,
    order = 'a',
  }: ChunkOpts): Promise<{ posts: Post[]; cursor: number }> {
    const filter = {} as Record<string, unknown>;
    if (categoryFilter) filter.category = categoryFilter;
    if (titleContainsFilter)
      filter.title = RegExp('.*' + regexEscape(titleContainsFilter) + '.*');
    const sortOrder = { a: -1, d: 1 }[order] ?? -1;

    const posts = (
      await (await this.collection)
        .find(filter)
        .sort('updatedAt', sortOrder)
        .skip(from)
        .limit(limit)
        .toArray()
    ).map((e) => Post.parse(e));

    const cursor = from + posts.length;
    return { posts, cursor };
  }
}
