import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import Navbar from '@/Navbar.vue';

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("Navbar.vue", () => {
    const store = new Store({
        getters: {
            isAuthenticated: () => true,
            username: () => 'klaus',
        }
    });
    const wrapper = shallowMount(Navbar, {
        store, 
        localVue
    });

    it("creates a wrapper", () => {
        expect(wrapper.exists()).toBe(true);
    })

    it("shows workbench headline", () =>{
        let headline = wrapper.find('strong');
        expect(headline.text()).toBe('iDAI.workbench')
    })
});