<template>
  <div class="Progress">
    <el-progress type="dashboard"
                 :percentage="percentage"
                 :color="colors"/>
  </div>
</template>

<script>
  export default {
    name: 'Progress',
    data() {
      return {
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100},
        ],
      }
    },
    props: {
      percentage: {
        type: Number,
        default: 0,
      },
    },
  }
</script>

<style scoped>

</style>
