import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // TODO: store url in .env (in cilantro dir, not frontend)
        backendURI: 'http://localhost:5000/',

        authentification: {
            authentificated: false,
            credentials: {
                name: '',
                password: ''
            }
        },

        job: {
            type: undefined
        }
    },
    mutations: {
        login: (state, payload) => {
            axios.get(state.backendURI + 'user/' + payload.name, {
                auth: {
                    username: payload.name,
                    password: payload.password
                }
            }
            ).then((data) => {
                state.authentification.credentials.name = payload.name
                state.authentification.credentials.password = payload.password
                state.authentification.authentificated = true
            }).catch((error) => {
                console.log(error)
            })
        },
        logout: state => {
            state.authentification.credentials.name = ''
            state.authentification.credentials.password = ''
            state.authentification.authentificated = false
        },
        startJob: (state, payload) => {
            state.job.type = payload.name
        }
    }
})
