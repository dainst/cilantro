import { mount, createLocalVue } from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, { Store } from 'vuex';
import Router from 'vue-router';
import flushPromises from 'flush-promises';
import AuthenticationStore from '@/authentication/AuthenticationStore';
import AuthenticationStatus from '@/authentication/AuthenticationStatus';
import Login from '@/Login.vue';

const MockComponent = { template: '<div class="login_success">Login success</div>' };

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            noAuth: true
        }
    }, {
        path: '/',
        name: 'login_sucess',
        component: MockComponent
    }
];

const mockLogin = jest.fn();
jest.mock('@/authentication/AuthenticationStore', () => jest.fn().mockImplementation(() => ({
    login: mockLogin
})));

jest.mock('@/util/Notifier.ts', () => ({
    showError() {
        mockLogin();
        return true;
    }
}));

const authStore = new AuthenticationStore({});
jest.mock('vuex-module-decorators', () => ({
    getModule: jest.fn().mockImplementation(() => authStore)
}));

const localVue = createLocalVue();
localVue.use(Buefy);
localVue.use(Vuex);
localVue.use(Router);

describe('Login.vue', () => {
    let wrapper: any;
    let store: any;
    let router: any;
    beforeEach(() => {
        router = new Router({ routes });
        store = new Store({
            state: {
                status: AuthenticationStatus.Out
            },
            getters: {
                authStatus: state => state.status
            },
            mutations: {
                setError(state: any) {
                    state.status = AuthenticationStatus.Error;
                },
                setSuccess(state: any) {
                    state.status = AuthenticationStatus.In;
                }
            }
        });
        wrapper = mount(Login, {
            localVue,
            store,
            router
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('submits the login form', async() => {
        const inputUser = wrapper.find('#username');
        const inputPw = wrapper.find('#password');
        inputUser.setValue('santa');
        await flushPromises();

        inputPw.setValue('klaus');
        await flushPromises();

        await wrapper.vm.$nextTick();

        const button = wrapper.find('button');
        expect(button.attributes('disabled')).toBeFalsy();
        button.trigger('click');
        await wrapper.vm.$nextTick();

        expect(mockLogin).toBeCalled();
    });

    it('shows an login failed error', async() => {
        store.commit('setError');
        expect(wrapper.exists('.snackbar')).toBeTruthy();
    });

    it('calls router push to /', async() => {
        store.commit('setSuccess');
        await wrapper.vm.$nextTick();
        expect(wrapper.exists('div.login_success')).toBe(true);
    });
});
