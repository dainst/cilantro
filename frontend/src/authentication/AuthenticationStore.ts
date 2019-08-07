import axios from 'axios';
import {
    Module, VuexModule, Mutation, Action
} from 'vuex-module-decorators';
import AuthenticationStatus from './AuthenticationStatus';
import store from '@/store';
import User from './User';

@Module({
    dynamic: true,
    name: 'AuthenticationStore',
    store
})
export default class AuthenticationStore extends VuexModule {
    backendUri = process.env.VUE_APP_BACKEND_URI || '/api';

    authentication = {
        status: AuthenticationStatus.Out,
        credentials: {
            name: localStorage.getItem('username') || '',
            password: localStorage.getItem('password') || ''
        }
    };

    @Mutation
    showPrompt() {
        this.authentication.status = AuthenticationStatus.Prompt;
    }

    @Mutation
    setPending() {
        this.authentication.status = AuthenticationStatus.Pending;
    }

    @Mutation
    setSuccess(user: User) {
        this.authentication.status = AuthenticationStatus.In;
        this.authentication.credentials.name = user.name;
        this.authentication.credentials.password = user.password;
    }

    @Mutation
    setError() {
        this.authentication.status = AuthenticationStatus.Error;
    }

    @Mutation
    setLoggedOut() {
        this.authentication.status = AuthenticationStatus.Out;
    }

    @Action
    async login(user: User) {
        this.context.commit('setPending');

        try {
            const response = await axios({
                url: `${this.backendUri}/user/${user.name}`,
                auth: { username: user.name, password: user.password },
                method: 'GET'
            });
            persistUser(user);
            this.context.commit('setSuccess', user);
        } catch (err) {
            console.error(err);
            this.context.commit('setError');
            forgetUser();
        }
    }

    @Action
    logout() {
        this.context.commit('setLoggedOut');
        forgetUser();
    }

    @Action
    promptLogin() {
        this.context.commit('showPrompt');
    }

    get isAuthenticated() {
        return this.authentication.status === AuthenticationStatus.In;
    }

    get authStatus() {
        return this.authentication.status;
    }

    get username() {
        return this.authentication.credentials.name;
    }
}

function persistUser(user: User) {
    localStorage.setItem('username', user.name);
    localStorage.setItem('password', user.password);
    const basicAuth = btoa(`${user.name}:${user.password}`);
    axios.defaults.headers.common.Authorization = `Basic ${basicAuth}`;
}

function forgetUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    delete axios.defaults.headers.common.Authorization;
}
