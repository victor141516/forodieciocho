export const CATEGORY_REGEX = /(\+1[2-8])/;

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
  readonly id: string;
  readonly title: string;
  readonly category: PostCategory;

  constructor(id: string, title: string, category: PostCategory) {
    this.id = id;
    this.title = title;
    this.category = category;
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
    };
  }

  static parse(serialized: Record<string, unknown>): Post {
    return new Post(
      serialized.id as string,
      serialized.title as string,
      serialized.category as PostCategory
    );
  }
}
