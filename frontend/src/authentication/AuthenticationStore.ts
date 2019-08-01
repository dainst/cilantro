import AuthenticationStatus from './AuthenticationStatus';
import axios from 'axios';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store';

@Module({
    dynamic: true,
    name: 'AuthenticationStore',
    store
})
export default class AuthenticationStore extends VuexModule {

    // TODO: store url in .env (in cilantro dir, not frontend)
    backendURI = 'http://localhost:5000/';

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
    setSuccess(user: any) {
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
    async login(user: any) {

        this.context.commit('setPending');

        try {

            const response = await axios({
                url: `http://localhost:5000/user/${user.name}`,
                auth: { username: user.name, password: user.password },
                method: 'GET'
            });
            persistUser(user);
            this.context.commit('setSuccess', user);

        } catch (err) {
            console.error(err);
            this.context.commit('setError');
            removeUser();
        }
    };

    @Action
    logout() {
        this.context.commit('setLoggedOut');
        removeUser();
    };

    @Action
    promptLogin(context: any) {
        context.commit('showPrompt');
    };

    get isAuthenticated() {
        return this.authentication.status === AuthenticationStatus.In;
    };

    get authStatus() {
        return this.authentication.status
    };

    get username() {
        return this.authentication.credentials.name
    }

}

function persistUser(user: any) {
    localStorage.setItem('username', user.name);
    localStorage.setItem('password', user.password);
    const basicAuth = btoa(`${user.name}:${user.password}`);
    axios.defaults.headers.common.Authorization = `Basic ${basicAuth}`;
}

function removeUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    delete axios.defaults.headers.common.Authorization;
}
