<template>
  <div class="w-full lg:w-2/3 xl:w-1/2 mx-auto px-1 lg:px-0">
    <div class="flex flex-col items-center select-none">
      <a href="/" class="mt-4">
        <img class="mx-auto" alt="Logo" src="../assets/logo.png" />
      </a>
      <div class="w-full mt-3 lg:mt-8">
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
              <Limit
                @changeLimit="(val) => (query.limit.value = val)"
                :currentLimit="query.limit.value"
                @changeOrder="(val) => (query.order.value = val)"
                :currentOrder="query.order.value"
              ></Limit>
              <!-- <Order @changeOrder="(val) => (query.order.value = val)" :currentOrder="query.order.value"></Order> -->
            </div>
          </div>
          <Posts class="my-2 flex" :posts="posts"></Posts>
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
import Posts from '../components/Posts.vue'
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
