<template>
    <form class="login" @submit.prevent="login">
        <b-notification
            :type="errorType"
            :active.sync="errorActive"
            auto-close
            aria-close-label="Close notification"
            role="alert"
        >{{errorMessage}}
        </b-notification>
        <div v-if="!this.$store.getters.isAuthenticated">
            <b-field>
                <b-input placeholder="Name" minlength="1" type="text" required v-model="name">
                </b-input>
            </b-field>
            <b-field>
                <b-input
                    placeholder="Password"
                    minlength="1"
                    type="password"
                    required
                    v-model="password"
                ></b-input>
            </b-field>
            <b-button
                :disabled="missingInput"
                type="submit"
                class="button is-fullwidth"
                @click="login()"
            >Login</b-button>
        </div>
        <b-button class="is-fullwidth" v-if="this.$store.getters.isAuthenticated" @click="logout()">
            Logout
        </b-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { AuthenticationStatus } from '../store';

@Component
export default class Authentication extends Vue {
    name: string = '';
    password: string = '';
    showInputs: boolean = false;
    errorActive: boolean = false;
    errorMessage: string = '';
    errorType: string = ''

    get missingInput() {
        return this.name.length === 0 || this.password.length === 0;
    }

    login() {
        const { name } = this;
        const { password } = this;

        this.$store.dispatch('login', { name, password })
            .catch(err => console.log(err));
    }

    logout() {
        this.name = '';
        this.password = '';

        this.$store.dispatch('logout')
            .catch(err => console.log(err));
    }

    mounted() {
        this.$store.watch(
            (state, getters) => getters.authStatus,
            (newValue : AuthenticationStatus, oldValue : AuthenticationStatus) => {
                if (newValue === AuthenticationStatus.In) {
                    this.errorType = 'is-success';
                    this.errorMessage = 'Login successful';
                    this.errorActive = true;
                } else if (newValue === AuthenticationStatus.Out) {
                    this.errorType = '';
                    this.errorMessage = 'Logout successful';
                    this.errorActive = true;
                } else if (newValue === AuthenticationStatus.Pending) {
                    this.errorType = '';
                    this.errorMessage = 'Logging in...';
                    this.errorActive = true;
                } else if (newValue === AuthenticationStatus.Error) {
                    this.errorType = 'is-danger';
                    this.errorMessage = 'Login failed';
                    this.errorActive = true;
                } else if (newValue === AuthenticationStatus.Prompt) {
                    this.errorType = 'is-warning';
                    this.errorMessage = 'Please login';
                    this.errorActive = true;
                }
            }
        );
    }
}
</script>
