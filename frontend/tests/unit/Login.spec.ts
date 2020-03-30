import {shallowMount, createLocalVue } from '@vue/test-utils';
import { mocked } from 'ts-jest/utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'
import AuthenticationStore from '@/authentication/AuthenticationStore';
import Login from '@/Login.vue'

jest.mock('@/authentication/AuthenticationStore', () => ({
    login(obj: any) {
        console.log('name: ' + obj.name + ', ' + 'pw: ' + obj.password);
        return true;
    }
}));

const localVue = createLocalVue()
localVue.use(Buefy)
localVue.use(Vuex)

const $router = {
    push: jest.fn()
}

describe("Login.vue", () => {
    let wrapper: any;
    
    beforeEach(()=>{
        const store = new Store({});
        wrapper = shallowMount(Login, {
            localVue,
            store,
        }); 
        
        wrapper.setMethod( {
            createAuthStore: () => {}
        })

    })

   

    it("renders", () => {
        expect(wrapper.exists()).toBe(true)
    })

})