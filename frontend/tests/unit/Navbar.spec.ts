import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import Navbar from '@/Navbar.vue';

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("Navbar.vue", () => {
    const store = new Store({});
    const wrapper = shallowMount(Navbar, {store, localVue});

    it("renders", () => {
        expect(wrapper.exists()).toBe(true);
    })
});