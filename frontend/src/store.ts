import Vue from 'vue';
import Vuex from 'vuex';
import AuthenticationStore from './authentication/AuthenticationStore'

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production'
});
