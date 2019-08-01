import AuthenticationStatus from './AuthenticationStatus';
import axios from 'axios';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
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
    auth_prompt() {
        this.authentication.status = AuthenticationStatus.Prompt;
    }

    @Mutation
    auth_request() {
        this.authentication.status = AuthenticationStatus.Pending;
    }

    @Mutation
    auth_success(user: any) {
        this.authentication.status = AuthenticationStatus.In;
        this.authentication.credentials.name = user.name;
        this.authentication.credentials.password = user.password;
    }

    @Mutation
    auth_error() {
        this.authentication.status = AuthenticationStatus.Error;
    }

    @Mutation
    logged_out() {
        this.authentication.status = AuthenticationStatus.Out;
    }

    @Action
    async login(user: any) {

        this.context.commit('auth_request');

        try {

            const response = await axios({
                url: `http://localhost:5000/user/${user.name}`,
                auth: { username: user.name, password: user.password },
                method: 'GET'
            });

            localStorage.setItem('username', user.name);
            localStorage.setItem('password', user.password);

            const basicAuth = btoa(`${user.name}:${user.password}`);
            axios.defaults.headers.common.Authorization = `Basic ${basicAuth}`;

            this.context.commit('auth_success', user);

        } catch (err) {
            console.error(err);
            this.context.commit('auth_error');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
    };

    @Action
    logout() {
        this.context.commit('logged_out');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        delete axios.defaults.headers.common.Authorization;
    };

    @Action
    promptLogin(context: any) {
        context.commit('auth_prompt');
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
