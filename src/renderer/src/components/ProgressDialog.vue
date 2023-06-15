<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :align-center="true"
  >
    <div class="flex justify-center">
      <el-progress type="dashboard" :percentage="percentage" :color="colors" />
    </div>
    <template #footer>
      <el-button v-if="percentage === 100" @click="openDownloadPath">打开下载文件夹</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { hintMessage } from '../utils/tools'

const { downloadBook, openFilePath } = window.api.utils

interface Props {
  modelValue: boolean
  title: string
  href: string
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:modelValue': [visible: boolean]
  close: []
}>()

const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
const percentage = ref(0)

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const setPercentage = (num) => {
  percentage.value = num
}
async function startDownload() {
  const { title, href } = props
  const err = await downloadBook({ title, href }, setPercentage)
  if (err) {
    return hintMessage(err, closeDialog)
  }
}

function closeDialog() {
  emits('close')
  percentage.value = 0
}

function openDownloadPath() {
  openFilePath()
  closeDialog()
}
defineExpose({
  startDownload
})
</script>
