import { Post } from '../../libs/post'

interface GetPostParams {
  from?: string
  search?: string
  order?: 'a' | 'd'
  limit?: string
}

export const getPosts = async ({ from, search, order, limit }: GetPostParams) => {
  const params = new URLSearchParams()
  from && params.set('from', from.toString())
  search && params.set('search', search)
  order && params.set('order', order)
  limit && params.set('limit', limit)
  return fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/posts?${params.toString()}`).then(
    (r) => r.json() as Promise<{ cursor: number; posts: Post[] }>,
  )
}
