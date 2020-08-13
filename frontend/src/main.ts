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

const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

if (username && password) {
    store.dispatch('login', { name: username, password });
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
