import Vue from 'vue';
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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
