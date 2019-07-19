<template>
    <div>
        <b-button class="is-fullwidth" v-if="!isAuthentificated" @click="login()">Login</b-button>
        <b-button class="is-fullwidth" v-if="isAuthentificated" @click="logout()">Logout</b-button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
    get isAuthentificated() {
        return this.$store.state.authentification.authentificated
    };
    login() {
        this.$store.commit({
            type: 'login',
            name: 'u',
            password: 'p'
        })
    };
    logout() {
        this.$store.commit({
            type: 'logout'
        })
    }
}
</script>
