import { DateTime } from 'luxon'
import { Post, PostCategory } from '../post'

interface GetPostsParams {
  from?: string
  search?: string
  order?: 'a' | 'd'
  limit?: string
}

export interface GetPostsResponsePost {
  category: PostCategory
  createdAt: number
  id: string
  title: string
  updatedAt: number
}

interface GetPostsResponse {
  cursor: number
  posts: GetPostsResponsePost[]
}

const apiGetPosts = async ({ from, search, order, limit }: GetPostsParams) => {
  const params = new URLSearchParams()
  from && params.set('from', from.toString())
  search && params.set('search', search)
  order && params.set('order', order)
  limit && params.set('limit', limit)
  // @ts-ignore
  return fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/posts?${params.toString()}`).then(
    (r) => r.json() as Promise<GetPostsResponse>,
  )
}

const generateDevelopmentPosts = (page: number, limit: number, params: Record<string, unknown>) => {
  const posts = new Array(limit)
    .fill(null)
    .map(
      (_, i) =>
        new Post(
          `${page}-${i}`,
          `page ${page} post ${i + 1 + calculateFrom({ page, limit })} ${JSON.stringify(params)}`,
          Object.keys(PostCategory)[i % Object.keys(PostCategory).length] as PostCategory,
          DateTime.now().minus({ minutes: i + 1 + calculateFrom({ page, limit }) }),
          DateTime.now().minus({ minutes: i + 1 + calculateFrom({ page, limit }) }),
        ),
    )
  if (page === 4) {
    posts.splice(0, 3)
  } else if (page > 4) {
    posts.length = 0
  }
  return { cursor: page * limit, posts }
}

const calculateFrom = ({ page, limit }: { page: number; limit: number }) => (page - 1) * limit

export const getPosts = async ({
  page = 1,
  search = '',
  order = 'd',
  limit = 10,
}: {
  page?: number
  search?: string
  order?: GetPostsParams['order']
  limit?: number
}) => {
  // @ts-ignore
  if (import.meta.env.PROD) {
    const from = calculateFrom({ page, limit })
    const response = await apiGetPosts({ from: from.toString(), search, order, limit: limit.toString() })
    const posts = response.posts.map((p) => Post.parse(p))
    return { ...response, posts }
  } else {
    return generateDevelopmentPosts(page, limit, { search, order, limit })
  }
}
