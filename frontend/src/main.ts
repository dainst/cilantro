import Vue from 'vue';
import Axios from 'axios';
import Buefy from 'buefy';
import router from './router';
import store from './store';
import App from './App.vue';
import 'buefy/dist/buefy.css';

Vue.use(Buefy, {
    defaultIconPack: 'mdi',
    defaultContainerElement: '#content'
});

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

if (username && password) {
    try {
        store.dispatch('login', { name: username, password })
    } catch (err) {
        console.log(err);
    }
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isAuthenticated) {
            next();
        } else {
            store.dispatch('promptLogin');
            next();
        }
    } else {
        next();
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
