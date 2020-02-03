<template>
  <div class="home">


    <el-form :model="novel_config"
             label-width="110px"
             v-if="flag">

      <el-form-item label="主站">
        <el-select v-model="novel_config.local"
                   placeholder="请选择目标主站"
                   value="">
          <el-option
              v-for="item in locals"
              :key="item.local"
              :label="item.name"
              :value="item.local">
          </el-option>
        </el-select>
        <el-link type="primary"
                 @click="open_link"
                 v-if="novel_config.local">打开主站
        </el-link>

      </el-form-item>
      <el-form-item label="目标目录链接">
        <el-input v-model="novel_config.url" />
      </el-form-item>
      <el-form-item label="爬去目录关键字">
        <el-input v-model="keyword"
                  placeholder="默认为（正文）" />
      </el-form-item>
      <el-form-item label="下载路径">
        <input class="file-input"
               type="file"
               webkitdirectory
               @change="download_path"
               directory />
      </el-form-item>
      <el-form-item label="下载文件名称">
        <el-input v-model="file_name"
                  placeholder="默认为（novel.txt）" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="handle_download">下载
        </el-button>
      </el-form-item>
    </el-form>

    <Progress class="ProgressWrap"
              v-else
              :percentage="percentage" />
  </div>
</template>

<script>
  import download_novel from '../utils/download-novel'
  import Progress from '@/components/Progress'

  export default {

    name: 'home',
    components: {
      Progress,
    },
    data() {
      return {
        flag: true,
        progressNum: 0,
        percentage: 0,
        novel_config: {
          url: '',
          local: '',
          file_path: null,
        },
        file_name: '',
        keyword: '',
        locals: [
          {
            name: '笔趣阁',
            local: 'https://www.biquge.com.cn/',
          },
        ],
      }
    },
    methods: {
      progress(len) {
        this.percentage = ((++this.progressNum / len) * 100) | 0
      },
      handle_download() {
        this.flag = false
        console.log(this.novel_config)
        if (!Object.values(this.novel_config).every(val => val)) return alert('请填写完整的参数信息')
        const config = this.novel_config
        config.progress = this.progress
        this.file_name && (config['file_name'] = this.file_name)
        this.keyword && (config['keyword'] = this.keyword)

        download_novel(config, () => {
          this.flag = true
          new Notification('success', {
            body: '下载成功',
          })
        })
      },
      download_path(e) {
        this.novel_config.file_path = e.target.files.length
                                      ? e.target.files[0].path
                                      : this.novel_config.file_path
      },
      open_link() {
        this.$electron.shell.openExternal(this.novel_config.local)
      },
    },
  }
</script>

<style scoped
       lang="less">
  .ProgressWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
  }
</style>
