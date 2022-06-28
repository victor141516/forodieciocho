<template>
  <a
    class="flex items-center p-2 bg-gray-200 hover:bg-gray-300 border-2 border-blue-300"
    :href="`https://www.forocoches.com/foro/showthread.php?t=${post.id}`"
    target="_blank"
  >
    <div class="flex mr-2 w-12">
      <span class="mx-auto my-auto whitespace-nowrap">{{ getPostIcon(post) }}</span>
    </div>
    <span>{{ post.title }}</span>
    <div class="flex ml-auto pl-4">
      <span class="text-xs whitespace-nowrap">{{ getFormattedDate(post.updatedAt) }}</span>
    </div></a
  >
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'
import { defineComponent } from 'vue'
import { DateTime } from 'luxon'

import { Post } from '../libs/post'

export default defineComponent({
  name: 'Post',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props) {
    const categories: Record<string, string> = {
      '+18': '👉👌',
      '+16': '🎈🎈',
      '+14': '🍑🍑',
      unknown: '❓❔',
    }
    const getPostIcon = (post: Post): string => {
      return categories[post.category] ?? categories.unknown
    }
    const getFormattedDate = (jsDate: Date) => {
      const date = DateTime.fromJSDate(jsDate)
      const { days, hours, minutes } = DateTime.now().diff(date, ['days', 'hours', 'minutes'])
      if (days > 0) return `hace ${Math.round(days)} días`
      else if (hours > 0) return `hace ${Math.round(hours)} horas`
      else return `hace ${Math.round(minutes)} minutos`
    }
    return {
      post: props.post,
      getPostIcon,
      getFormattedDate,
    }
  },
})
</script>
