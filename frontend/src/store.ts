import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        // TODO: store url in .env (in cilantro dir, not frontend)
        backendURI: 'http://localhost:5000/',

        authentication: {
            authenticated: false,
            credentials: {
                name: '',
                password: ''
            }
        }
    },
    mutations: {
        login: (state, payload) => {
            state.authentication.credentials.name = payload.name;
            state.authentication.credentials.password = payload.password;
            state.authentication.authenticated = true;
        },
        logout: (state) => {
            state.authentication.credentials.name = '';
            state.authentication.credentials.password = '';
            state.authentication.authenticated = false;
        }
    }
});
