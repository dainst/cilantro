import AuthenticationStatus from './AuthenticationStatus';
import axios from 'axios';

const AuthenticationStore = {

    state: {
        // TODO: store url in .env (in cilantro dir, not frontend)
        backendURI: 'http://localhost:5000/',

        authentication: {
            status: AuthenticationStatus.Out,
            credentials: {
                name: localStorage.getItem('username') || '',
                password: localStorage.getItem('password') || ''
            }
        }
    },
    mutations: {
        auth_prompt: (state: any) => {
            state.authentication.status = AuthenticationStatus.Prompt;
        },
        auth_request: (state: any) => {
            state.authentication.status = AuthenticationStatus.Pending;
        },
        auth_success: (state: any, user: any) => {
            state.authentication.status = AuthenticationStatus.In;
            state.authentication.credentials.name = user.name;
            state.authentication.credentials.password = user.password;
        },
        auth_error: (state: any) => {
            state.authentication.status = AuthenticationStatus.Error;
        },

        logout: (state: any) => {
            state.authentication.status = AuthenticationStatus.Out;
        }
    },
    actions: {
        login: (context: any, user: any) => new Promise((resolve, reject) => {
            context.commit('auth_request');
            const response = axios({
                url: `http://localhost:5000/user/${user.name}`,
                auth: { username: user.name, password: user.password },
                method: 'GET'
            }).then(
                (resp) => {
                    localStorage.setItem('username', user.name);
                    localStorage.setItem('password', user.password);

                    const basicAuth = btoa(`${user.name}:${user.password}`);
                    axios.defaults.headers.common.Authorization = `Basic ${basicAuth}`;

                    context.commit('auth_success', user);
                    resolve(response);
                }, (err) => {
                    context.commit('auth_error');
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                    reject(err);
                }
            );
        }),
        logout: (context: any) => new Promise((resolve, reject) => {
            context.commit('logout');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            delete axios.defaults.headers.common.Authorization;
            resolve();
        }),
        promptLogin: (context: any) => new Promise((resolve, reject) => {
            context.commit('auth_prompt');
            resolve();
        })
    },
    getters: {
        isAuthenticated: (state: any) => (state.authentication.status === AuthenticationStatus.In),
        authStatus: (state: any) => state.authentication.status,
        username: (state: any) => state.authentication.credentials.name
    }

}

export default AuthenticationStore;
