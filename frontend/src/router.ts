import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';
import IngestJournal from './job/ingest-journal/IngestJournal.vue';
import Nlp from './job/nlp/Nlp.vue';
import IngestArchivalMaterial from './job/ingest-archival-material/IngestArchivalMaterial.vue';
import StagingArea from './staging/StagingArea.vue';
import JobDetails from './job/JobDetails.vue';
import JobList from './job/JobList.vue';
import Login from './Login.vue';
import NotFound from './NotFound.vue';
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
            path: '/jobs',
            name: 'jobs',
            component: JobList
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
            path: '/ingest-archival-material',
            name: 'ingest-archival-material',
            component: IngestArchivalMaterial
        },
        {
            path: '/nlp',
            name: 'nlp',
            component: Nlp
        },
        {
            path: '/job',
            name: 'job',
            component: JobDetails
        },
        {
            path: '/not-found',
            name: 'not-found',
            component: NotFound
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (!to.matched.length) {
        next('/not-found');
    } else if (!to.matched.some(record => record.meta.noAuth)) {
        if (store.getters.isAuthenticated) {
            next();
        } else {
            next({
                name: 'login',
                params: {
                    back: to.path
                },
                query: to.query
            });
        }
    } else {
        next();
    }
});

export default router;
