<template>
  <div class="flex pt-2 lg:pt-14">
    <div class="flex-1 flex flex-col mx-1 lg:mx-6 3xl:mx-56 select-none md:pb-8 pb-2">
      <a href="/">
        <img class="mx-auto" alt="Logo" src="../assets/logo.png" />
      </a>
      <div class="mt-2 lg:mt-8">
        <div v-if="posts.length > 0">
          <div class="flex items-center">
            <PageControl
              @next="query.page.value++"
              @previous="query.page.value > 1 && query.page.value--"
              :page="query.page.value"
            ></PageControl>
            <Search
              class="ml-4"
              @search="(term) => (query.search.value = term)"
              :initTerm="query.search.value"
            ></Search>
            <div class="ml-auto flex md:mr-6">
              <Limit @changeLimit="(val) => (query.limit.value = val)" :currentLimit="query.limit.value"></Limit>
              <Order @changeOrder="(val) => (query.order.value = val)" :currentOrder="query.order.value"></Order>
            </div>
          </div>
          <Post class="my-2 flex" v-for="post in posts" :key="post.id" :post="post"></Post>
          <PageControl
            @next="query.page.value++"
            @previous="query.page.value > 1 && query.page.value--"
            :page="query.page.value"
          ></PageControl>
        </div>
        <div v-else>
          <p>LOADING...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { Post as PostType } from '../services/post'
import * as query from '../services/query'
import PageControl from '../components/PageControl.vue'
import Search from '../components/Search.vue'
import Limit from '../components/Limit.vue'
import Order from '../components/Order.vue'
import Post from '../components/Post.vue'
import { getPosts } from '../services/api'
import { parseUrlParams } from '../services/query'

const posts = ref<PostType[]>([])
const fetchPosts = async () => {
  const res = await getPosts({
    page: query.page.value,
    limit: query.limit.value,
    order: query.order.value,
    search: query.search.value,
  })
  posts.value = res.posts
}
fetchPosts()

window.addEventListener('popstate', () => {
  parseUrlParams()
  fetchPosts()
})
query.addOnChangeListener(fetchPosts)
</script>
