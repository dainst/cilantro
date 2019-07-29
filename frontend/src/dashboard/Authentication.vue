<template>
    <form class="login" @submit.prevent="login">
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
        <div v-if="this.$store.getters.isAuthenticated">
                <b-icon icon="account" size="is-small">
                </b-icon> {{this.$store.getters.username}}
            <b-button class="is-fullwidth"  @click="logout()">
                Logout
            </b-button>
        </div>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AuthenticationStatus } from '../store';

@Component
export default class Authentication extends Vue {
    name: string = '';
    password: string = '';

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
}
</script>
