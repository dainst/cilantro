import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import Buefy from 'buefy';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('App.vue', () => {
    const store = new Store({});
    const wrapper = shallowMount(App, {
        store, localVue
    });
    it('renders input element', () => {
        const el = wrapper.find('footer');
        expect(el.is('footer')).toBe(true);
    });
});
