<template>
  <div class="flex pt-2 lg:pt-14">
    <div class="flex-1 flex flex-col mx-1 lg:mx-6 3xl:mx-56 select-none md:pb-8 pb-2">
      <a href="/">
        <img class="mx-auto" alt="Logo" src="./assets/logo.png" />
      </a>
      <div class="mt-2 lg:mt-8">
        <div v-if="posts.length > 0">
          <div class="flex items-center">
            <PageControl @next="goToNextPage" @previous="goToPreviousPage" :page="page"></PageControl>
            <Search class="ml-4" @search="onSearch"></Search>
            <div class="ml-auto flex md:mr-6">
              <Limit @changeLimit="onChangeLimit" :currentLimit="currentLimitProp"></Limit>
              <Order @changeOrder="changeOrder" :orderIcon="orderIcon"></Order>
            </div>
          </div>
          <AdPost class="my-2 flex"></AdPost>
          <Post class="my-2 flex" v-for="post in posts" :key="post.id" :post="post"></Post>
          <PageControl @next="goToNextPage" @previous="goToPreviousPage" :page="page"></PageControl>
        </div>
        <div v-else>
          <p>LOADING...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { Post as PostType, PostCategory } from './libs/post'
import AdPost from './components/AdPost.vue'
import Limit from './components/Limit.vue'
import Order from './components/Order.vue'
import Post from './components/Post.vue'
import PageControl from './components/PageControl.vue'
import Search from './components/Search.vue'
import { getPosts } from './services/api'

const getUrlParam = (param: string) => new URLSearchParams(location.search).get(param)

const posts = ref<PostType[]>(
  new Array(import.meta.env.PROD ? 0 : 10).fill(new PostType('0', 'a', PostCategory['+18'], new Date(), new Date())),
)
const getLimit = () => Number.parseInt(getUrlParam('limit') ?? '10')
const getPageNumber = () => Number.parseInt(getUrlParam('from') ?? '0') / getLimit()
const page = ref(getPageNumber())
let nextCursor: number
let hasNextPage = true
let isFetchingData = false

const fetchPosts = async () => {
  if (isFetchingData) return
  isFetchingData = true
  const params = {} as Record<string, string>
  if (getUrlParam('from')) params.from = getUrlParam('from')!
  if (getUrlParam('search')) params.search = getUrlParam('search')!
  if (getUrlParam('order')) params.order = getUrlParam('order')!
  params.limit = getLimit().toString()

  return getPosts(params).then((r) => {
    if (r.posts.length === getLimit()) {
      nextCursor = r.cursor
    }
    hasNextPage = r.posts.length !== 0
    if (hasNextPage) {
      posts.value = r.posts.map(
        (p) => new PostType(p.id, p.title, p.category, new Date(p.createdAt), new Date(p.updatedAt)),
      )
    }
    isFetchingData = false
  })
}

const changeUrl = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams(location.search)
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined) query.set(k, params[k]!.toString())
    else query.delete(k)
  })
  history.pushState(null, '', `${location.origin}${location.pathname}?${query.toString()}`)
  page.value = getPageNumber()
}
const goToNextPage = () => {
  if (!hasNextPage) return
  changeUrl({ from: nextCursor })
  fetchPosts()
}
const goToPreviousPage = () => {
  if (nextCursor === 0) return
  nextCursor = Math.max(0, nextCursor - getLimit() * 2)
  changeUrl({ from: nextCursor })
  fetchPosts()
}

window.addEventListener('popstate', () => fetchPosts())

const onSearch = (term: string) => {
  nextCursor = 0
  changeUrl({
    from: undefined,
    search: term === '' ? undefined : term,
  })
  fetchPosts()
}

if (import.meta.env.PROD) onMounted(() => fetchPosts())

const getOrderIcon = () => ((getUrlParam('order') ?? 'a') === 'a' ? '👇' : '☝️')
const orderIcon = ref(getOrderIcon())
const changeOrder = () => {
  changeUrl({
    order: { a: 'd', d: 'a' }[getUrlParam('order') ?? 'a'],
  })
  fetchPosts()
  orderIcon.value = getOrderIcon()
}

const currentLimitProp = ref(getLimit())
const onChangeLimit = (newLimit: number) => {
  currentLimitProp.value = newLimit
  changeUrl({ limit: newLimit })
  fetchPosts()
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
