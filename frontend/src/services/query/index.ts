import { ref, watch } from 'vue'

const changeUrl = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams(location.search)
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined) query.set(k, params[k]!.toString())
    else query.delete(k)
  })
  const qs = `?${query.toString()}`
  if (qs !== location.search) {
    history.pushState(null, '', `${location.origin}${location.pathname}${qs}`)
  }
}

export const page = ref<number>(0)
export const limit = ref<number>(0)
export const order = ref<'a' | 'd'>('d')
export const search = ref<string>('')
export const parseUrlParams = () => {
  const urlParamsObj = new URLSearchParams(location.search)
  const urlParams = {
    page: parseInt(urlParamsObj.get('page') ?? '1'),
    limit: parseInt(urlParamsObj.get('limit') ?? '10'),
    order: (urlParamsObj.get('order') ?? 'a') as 'a' | 'd',
    search: urlParamsObj.get('search') ?? '',
  }
  page.value = urlParams.page
  limit.value = urlParams.limit
  order.value = urlParams.order
  search.value = urlParams.search
}

parseUrlParams()

watch(page, () => {
  changeUrl({ page: page.value })
  runListeners()
})

watch(limit, () => {
  changeUrl({ limit: limit.value, page: undefined })
  page.value = 1
  runListeners()
})

watch(order, () => {
  changeUrl({ order: order.value, page: undefined })
  page.value = 1
  runListeners()
})

watch(search, () => {
  changeUrl({ search: search.value === '' ? undefined : search.value, page: undefined })
  page.value = 1
  runListeners()
})

const onChangeListeners = new Set<() => void>()
const runListeners = () => {
  onChangeListeners.forEach((l) => l())
}
export const addOnChangeListener = (cb: () => void) => {
  onChangeListeners.add(cb)
}
