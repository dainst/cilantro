import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {

        // TODO: store url in .env (in cilantro dir, not frontend)
        backendURI: 'http://localhost:5000/',
        // TODO: Login service and password hash
        user: 'u',
        password: 'p'
    },
    mutations: {

    },
    actions: {

    }
})
