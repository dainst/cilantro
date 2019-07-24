import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './dashboard/Dashboard.vue'
import JournalImport from './job/ingest-journal/JournalImport.vue'
import StagingArea from './staging/StagingArea.vue'
import JobDetails from './job/JobDetails.vue'

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
        },
        {
            path: '/job',
            name: 'job',
            component: JobDetails
        }
    ]
})
