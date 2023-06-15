import * as VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/download-list',
    name: 'downloadList',
    component: () => import('../views/DownloadList.vue')
  }
]
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})

export default router
