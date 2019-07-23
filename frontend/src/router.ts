import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import JournalImport from './views/JournalImport.vue'
import StagingArea from '@/views/StagingArea.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/staging',
            name: 'staging',
            component: StagingArea
        },
        {
            path: '/JournalImport',
            name: 'JournalImport',
            component: JournalImport
        }
    ]
})
