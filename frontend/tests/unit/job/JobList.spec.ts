import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import JobList from '@/job/JobList.vue'

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("JobList.vue", () => {
    const store = new Store({});
    const wrapper = shallowMount(JobList, {store, localVue})

    it("loads proberly", () => {
        expect(wrapper.exists()).toBe(true)
    })

    it("shows navbar", () => {
        expect(wrapper.find('div.navbar').exists()).toBe(true)
    })
})