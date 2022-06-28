import { Post } from '../../libs/post'

interface GetPostParams {
  from?: number
  search?: string
  order?: 'a' | 'd'
}

export const getPosts = async ({ from, search, order }: GetPostParams): Promise<Post[]> => {
  const params = new URLSearchParams()
  from && params.set('from', from.toString())
  search && params.set('search', search)
  order && params.set('order', order)
  return fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/posts?${params.toString()}`).then(
    (r) => r.json() as Promise<Post[]>,
  )
}
