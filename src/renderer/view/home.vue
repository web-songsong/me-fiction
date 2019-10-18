<template>
  <div class="home">


    <el-form :model="novel_config"
             label-width="80px">

      <el-form-item label="主站">
        <el-select v-model="novel_config.local"
                   placeholder="请选择目标主站">
          <el-option
              v-for="item in locals"
              :key="item.local"
              :label="item.name"
              :value="item.local">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标链接">
        <el-input v-model="novel_config.url"></el-input>
      </el-form-item>
      <el-form-item label="下载路径">
        <input class="file-input"
               type="file"
               webkitdirectory
               @change="testChange"
               directory/>
      </el-form-item>
      <el-form-item label="目标链接">
        <el-input v-model="file_name"
                  placeholder="默认为（novel.txt）"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="handle_download">下载
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import download_novel from '../utils/download-novel'

  export default {

    name: "home",
    data() {
      return {
        novel_config: {
          url: 'https://www.qu.la/book/233849/',
          local: 'https://www.qu.la',
          file_path: '/Users/charmingsong/Desktop',

        },
        file_name: '',
        locals: [
          {
            name: '笔趣阁: qu.la',
            local: 'https://www.qu.la'
          }
        ]
      }
    },
    methods: {
      handle_download() {
        console.log(this.novel_config)
        if (!Object.values(this.novel_config).every(val => val)) return alert('请选择下载路径')
        const config = this.novel_config
        this.file_name && (config['file_name'] = this.file_name)
        download_novel(config, () => new Notification('success', {
          body: '下载成功'
        }))
      },
      testChange(e) {

        this.novel_config.file_path = e.target.files.length ? e.target.files[0].path : this.novel_config.file_path
      }
    },
  }
</script>

<style scoped
       lang="less">

</style>