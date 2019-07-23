import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        refreshStaging: false
    },
    mutations: {
        refresh(state) {
            state.refreshStaging = true
        },
        refreshed(state) {
            state.refreshStaging = false
        }
    },
    actions: {

    }
})
