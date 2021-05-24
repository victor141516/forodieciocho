import { Collection, MongoClient } from 'mongodb';
import { Post, PostCategory } from '../post';

export interface ChunkOpts {
  from?: number;
  limit?: number;
  categoryFilter?: PostCategory;
  titleContainsFilter?: string;
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
    return new Promise(async (resolve, reject) =>
      (await this.collection).updateOne(
        { id: post.id },
        { $set: post.serialize() },
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
  }: ChunkOpts): Promise<{ posts: Post[]; cursor: number }> {
    const filter = {} as Record<string, unknown>;
    if (categoryFilter) filter.category = categoryFilter;
    if (titleContainsFilter)
      filter.title = RegExp('.*' + titleContainsFilter + '.*');

    const posts = (
      await (await this.collection)
        .find(filter)
        .skip(from)
        .limit(limit)
        .toArray()
    ).map((e) => Post.parse(e));

    const cursor = from + posts.length;
    return { posts, cursor };
  }
}
