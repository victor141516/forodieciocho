import { DateTime } from 'luxon'

import { GetPostsResponsePost } from '../api'

export const CATEGORY_REGEX = /(\+1[2-8])(?:\ |$)/

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
  id: string
  title: string
  category: PostCategory
  createdAt: DateTime
  updatedAt: DateTime

  constructor(id: string, title: string, category: PostCategory, createdAt?: DateTime, updatedAt?: DateTime) {
    this.id = id
    this.title = title
    this.category = category
    this.createdAt = createdAt ?? DateTime.now()
    this.updatedAt = updatedAt ?? DateTime.now()
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      createdAt: this.createdAt.toMillis(),
      updatedAt: this.updatedAt.toMillis(),
    }
  }

  static parse(serialized: GetPostsResponsePost): Post {
    return new Post(
      serialized.id as string,
      serialized.title as string,
      serialized.category as PostCategory,
      DateTime.fromMillis(serialized.createdAt as number),
      DateTime.fromMillis(serialized.updatedAt as number),
    )
  }
}
