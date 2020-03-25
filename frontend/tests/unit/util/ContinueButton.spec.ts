import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import BButton from 'buefy/src/components/button/BButton.vue';
import Vuex, {Store} from 'vuex'

import ContinueButton from '@/util/ContinueButton.vue'

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("ContinueButton.vue", () => {
    let wrapper: any;

    beforeEach(()=>{
        const store = new Store({});
        wrapper = shallowMount(ContinueButton, {
            localVue,
            store,
            methods: {
                onClick: jest.fn()
            }
        });
    })

    it("renders", () => {
        expect(wrapper.exists()).toBe(true)
    })

})
