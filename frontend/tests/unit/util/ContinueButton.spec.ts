import { mount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import ContinueButton from '@/util/ContinueButton.vue'

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

describe("ContinueButton.vue", () => {
    let wrapper: any;

    beforeEach(()=>{
        const store = new Store({});
        wrapper = mount(ContinueButton, {localVue, store});
    })

    it("renders", () => {
        expect(wrapper.exists()).toBe(true)
    })

    it("was clicked", () => {
        let button = wrapper.find('button');
        expect(button.attributes('disabled')).toBeFalsy();
        button.trigger('click')
        wrapper.vm.$nextTick();
        expect(wrapper.emitted('click')).toBeTruthy();
    })

})
