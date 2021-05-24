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

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      category: this.category,
    });
  }

  static parse(serialized: string): Post {
    const obj = JSON.parse(serialized);
    return new Post(obj.id, obj.title, obj.category);
  }
}
