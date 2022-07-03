<template>
  <div class="shadow rounded-md">
    <ul role="list" class="w-full divide-y divide-primary-100">
      <li
        v-for="(post, index) in posts"
        :key="post.id"
        class="hover:lg:scale-110 hover:border-transparent transition-all bg-white"
        :class="{
          'rounded-t-md': index === 0,
          'rounded-b-md': index === posts.length - 1,
        }"
      >
        <a
          :href="`https://www.forocoches.com/foro/showthread.php?t=${post.id}`"
          target="_blank"
          class="block hover:bg-primary-100 text-gray-800 hover:text-primary-700 sm:hover:font-bold transition-all"
          :class="{
            'hover:rounded-t-md': index === 0,
            'hover:rounded-b-md': index === posts.length - 1,
          }"
        >
          <div class="px-4 py-4 flex">
            <div class="flex-1 flex items-center justify-between truncate">
              <p class="text-sm truncate">
                <span class="text-xs text-gray-600">{{ getPostIcon(post) }}</span>
                <span class="ml-2">{{ post.title }}</span>
              </p>
              <div class="ml-2 flex-shrink-0 flex">
                <p
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800 tracking-normal"
                >
                  {{ getFormattedDate(post.updatedAt) }}
                </p>
              </div>
            </div>
            <div class="mt-2">
              <div class="">
                <p class="flex items-center text-sm text-gray-500"></p>
              </div>
              <div class="flex items-center text-sm text-gray-500"></div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'

import { Post } from '../services/post'
defineProps<{ posts: Post[] }>()

const categories: Record<string, string> = {
  '+18': '👉👌',
  '+16': '🎈🎈',
  '+14': '🍑🍑',
  unknown: '❓❔',
}
const getPostIcon = (post: Post): string => {
  return categories[post.category] ?? categories.unknown
}
const getFormattedDate = (date: DateTime) => {
  const { days, hours, minutes } = DateTime.now().diff(date, ['days', 'hours', 'minutes'])
  if (days > 0) return `hace ${Math.round(days)} días`
  else if (hours > 0) return `hace ${Math.round(hours)} horas`
  else return `hace ${Math.round(minutes)} minutos`
}

const positions = [
  {
    id: 1,
    title: 'Back End Developer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
    closeDate: '2020-01-07',
    closeDateFull: 'January 7, 2020',
  },
  {
    id: 2,
    title: 'Front End Developer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
    closeDate: '2020-01-07',
    closeDateFull: 'January 7, 2020',
  },
  {
    id: 3,
    title: 'User Interface Designer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Design',
    closeDate: '2020-01-14',
    closeDateFull: 'January 14, 2020',
  },
]
</script>
