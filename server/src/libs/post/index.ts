export const CATEGORY_REGEX = /(\+1[2-8])(?:\ |$)/;

export enum PostCategory {
  '+12' = '+12',
  '+13' = '+13',
  '+14' = '+14',
  '+15' = '+15',
  '+16' = '+16',
  '+17' = '+17',
  '+18' = '+18',
}

export class Post {
  id: string;
  title: string;
  category: PostCategory;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    category: PostCategory,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime(),
    };
  }

  static parse(serialized: Record<string, unknown>): Post {
    return new Post(
      serialized.id as string,
      serialized.title as string,
      serialized.category as PostCategory,
      new Date(serialized.createdAt as number),
      new Date(serialized.updatedAt as number)
    );
  }
}
