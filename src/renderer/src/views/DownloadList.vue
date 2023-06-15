<template>
  <ProgressDialog
    ref="refDownloadDialog"
    v-model="visible"
    :title="clickRowData.title"
    :href="clickRowData.href"
    @close="resetData"
  ></ProgressDialog>
  <div v-loading="loading">
    <el-button class="mt10 ml4" @click="handleJump">返回</el-button>
    <el-table
      :data="tableData"
      border
      max-height="300px"
      class="mt-20 ma w250 pl4 pr4"
      size="small"
    >
      <el-table-column
        v-for="item in tableColumnList"
        :key="item.prop"
        align="left"
        :prop="item.label"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-button :disabled="downloadFlag" link type="primary" @click="handleDownload(row)"
            >download</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      class="mt5"
      layout="prev, pager, next"
      :default-page-size="1"
      :total="lastPageNumber"
      :hide-on-single-page="true"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup lang="ts">
// '文章名称', '最新章节', '作者', '字数', '更新', '状态', 'href', 'title'

import { useRouter } from 'vue-router'
import { hintMessage, local_storage } from '../utils/tools'
import { nextTick, reactive, ref } from 'vue'
import ProgressDialog from '../components/ProgressDialog.vue'

const { getBookName } = window.api.utils

const tableColumnList = [
  {
    prop: 'name',
    label: '文章名称',
    width: '200'
  },
  {
    prop: 'latestChapter',
    label: '最新章节',
    width: '300'
  },
  {
    prop: 'author',
    label: '作者',
    width: '120'
  },
  {
    prop: 'wordCount',
    label: '字数',
    width: '100'
  },
  {
    prop: 'updateTime',
    label: '更新',
    width: '100'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100'
  }
]
let tableData = reactive(local_storage.get('bookInfo') || [])
const lastPageNumber = ref(+local_storage.get('lastPageNumber') || 1)
const current = ref(1)
const router = useRouter()
const loading = ref(false)

function handleJump(): void {
  router.push({
    name: 'Search'
  })
}

async function handleCurrentChange(page) {
  loading.value = true
  const data = await getBookName(router.currentRoute.value.query.bookName, page)
  if (typeof data === 'string') {
    await hintMessage('搜索出错')
    loading.value = false
    return
  }
  current.value = page
  tableData = data[0]
  lastPageNumber.value = +data[1] || lastPageNumber.value
  loading.value = false
}

let clickRowData = reactive<{ title: string; href: string }>({ title: '', href: '' })
const downloadFlag = ref(false)
const visible = ref(false)
const refDownloadDialog = ref()
function handleDownload(row) {
  clickRowData = row
  visible.value = true
  downloadFlag.value = true
  nextTick(() => {
    refDownloadDialog.value.startDownload()
  })
}

function resetData() {
  downloadFlag.value = false
  clickRowData = { title: '', href: '' }
  visible.value = false
}
</script>
