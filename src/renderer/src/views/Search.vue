<template>
  <div v-loading="isSearch" class="h-screen flex items-center w-80% ma">
    <el-input
      ref="refInput"
      v-model.trim="input"
      autofocus
      placeholder="请输入小说名称"
      class="input-with-select"
      :disabled="isSearch"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-button :icon="btnIcon" :disabled="!input || isSearch" @click="handleSearch" />
      </template>
    </el-input>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Loading } from '@element-plus/icons-vue'
import { hintMessage, local_storage } from '../utils/tools'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  resetPageInfo()
})
const refInput = ref()

const { getBookName } = window.api.utils

const input = ref('')
const isSearch = ref(false)
const btnIcon = computed(() => (isSearch.value ? Loading : Search)) as unknown

function resetPageInfo(): void {
  input.value = ''
  isSearch.value = false
  local_storage.remove('bookInfo')
  local_storage.remove('lastPageNumber')
  refInput.value.focus()
}

async function handleSearch(): Promise<void> {
  if (!input.value) return
  isSearch.value = true
  const data = await getBookName(input.value)
  if (typeof data === 'string') {
    return await hintMessage(data, resetPageInfo)
  }
  local_storage.set('bookInfo', data[0])
  local_storage.set('lastPageNumber', data[1])
  await router.push({
    name: 'downloadList',
    query: {
      bookName: input.value
    }
  })
}
</script>
