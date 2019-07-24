<template>
    <div>
        <div v-if="!isAuthenticated">
            <b-notification
                :type="errorType"
                :active.sync="errorActive"
                auto-close
                aria-close-label="Close notification"
                role="alert"
            >{{errorMessage}}</b-notification>
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
                class="button is-fullwidth"
                @click="login()"
            >Login</b-button>
        </div>
        <b-button class="is-fullwidth" v-if="isAuthenticated" @click="logout()">Logout</b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class Authentication extends Vue {
    name: string = '';
    password: string = '';
    showInputs: boolean = false;
    errorActive: boolean = false;
    errorMessage: string = '';
    errorType: string = ''

    get isAuthenticated() {
        return this.$store.state.authentication.authenticated;
    }

    get missingInput() {
        return this.name.length === 0 || this.password.length === 0;
    }

    login() {
        axios
            .get(`${this.$store.state.backendURI}user/${this.name}`, {
                auth: {
                    username: this.name,
                    password: this.password
                }
            })
            .then((data) => {
                this.$store.commit({
                    type: 'login',
                    name: this.name,
                    password: this.password
                });
            })
            .catch((error) => {
                if (error.response === undefined) {
                    this.errorMessage =
                        'Failed to connect to server.';
                    this.errorType = 'is-danger';
                    this.errorActive = true;
                }
                if (error.response.status === 401) {
                    this.errorMessage =
                        'Your credentials seem to be invalid, please try again.';

                    this.errorType = 'is-warning';
                    this.errorActive = true;
                } else {
                    console.error('Invalid Server Response:', error.response);
                }
            });
    }

    logout() {
        this.name = '';
        this.password = '';

        this.$store.commit({
            type: 'logout'
        });
    }
}
</script>
