import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';
import IngestJournal from './job/ingest-journal/IngestJournal.vue';
import StagingArea from './staging/StagingArea.vue';
import JobDetails from './job/JobDetails.vue';

Vue.use(Router);

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
            component: StagingArea,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/ingest-journal',
            name: 'ingest-journal',
            component: IngestJournal,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/job',
            name: 'job',
            component: JobDetails,
            meta: {
                requiresAuth: true
            }
        }
    ]
})
