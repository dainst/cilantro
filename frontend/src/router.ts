import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';
import IngestJournal from './job/ingest-journal/IngestJournal.vue';
import StagingArea from './staging/StagingArea.vue';
import JobDetails from './job/JobDetails.vue';
import Login from './Login.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                noAuth: true
            }
        },
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
            path: '/ingest-journal',
            name: 'ingest-journal',
            component: IngestJournal
        },
        {
            path: '/job',
            name: 'job',
            component: JobDetails
        }
    ]
});

router.beforeEach(async(to, from, next) => {
    if (!to.matched.some(record => record.meta.noAuth)) {
        if (store.getters.isAuthenticated) {
            next();
        } else {
            next({ name: 'login', params: { back: to.path } });
        }
    } else {
        next();
    }
});

export default router;
