import { shallowMount, createLocalVue } from '@vue/test-utils'
import Buefy from 'buefy'
import App from '@/App.vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)


describe('App.vue', () => {
    const wrapper = shallowMount(App, {
        localVue
    })

    it('renders input element', () => {
        const el = wrapper.find('footer')
        expect(el.is('footer')).toBe(true)
    })
})
