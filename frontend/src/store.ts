import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export enum AuthenticationStatus {
    In, Out, Pending, Error, Prompt
}

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        // TODO: store url in .env (in cilantro dir, not frontend)
        backendURI: 'http://localhost:5000/',

        authentication: {
            status: AuthenticationStatus.Out,
            credentials: {
                name: localStorage.getItem('username') || '',
                password: localStorage.getItem('password') || ''
            }
        }
    },
    mutations: {
        auth_prompt: (state) => {
            state.authentication.status = AuthenticationStatus.Prompt
        },
        auth_request: (state) => {
            state.authentication.status = AuthenticationStatus.Pending
        },
        auth_success: (state, [user, password]) => {
            state.authentication.status = AuthenticationStatus.In
            state.authentication.credentials.name = user
            state.authentication.credentials.password = password
        },
        auth_error: (state) => {
            state.authentication.status = AuthenticationStatus.Error
        },

        logout: (state) => {
            state.authentication.status = AuthenticationStatus.Out
        },
    },
    actions: {
        login: ({ commit }, user) => {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({
                    url: 'http://localhost:5000/user/' + user.name,
                    auth: { username: user.name, password: user.password }, method: 'GET'
                })
                    .then(resp => {
                        localStorage.setItem('username', user.name)
                        localStorage.setItem('password', user.password)
                        axios.defaults.headers.common['Authorization'] = 'Basic ' + btoa(user.name + ':' + user.password);
                        commit('auth_success', user.name, user.password)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('username')
                        localStorage.removeItem('password')
                        reject(err)
                    })
            })
        },
        logout: ({ commit }) => {
            return new Promise((resolve, reject) => {
                commit('logout')
                localStorage.removeItem('username')
                localStorage.removeItem('password')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        },
        promptLogin: ({ commit }) => {
            return new Promise((resolve, reject) => {
                commit('auth_prompt')
                resolve()
            })
        }
    },
    getters: {
        isAuthenticated: state => (state.authentication.status === AuthenticationStatus.In),
        authStatus: state => state.authentication.status,
    }
});
