import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import JobList from '@/job/JobList.vue'

describe("JobList.vue", () => {
    const wrapper = shallowMount(JobList, {})

    it("loads proberly", () => {
        expect(wrapper.exists()).toBe(true)
    })
})