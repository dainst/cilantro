<template>
  <form class="login" @submit.prevent="login">
    <div v-if="!this.$store.getters.isAuthenticated">
      <b-field>
        <b-input placeholder="Name" minlength="1" type="text" required v-model="name"></b-input>
      </b-field>
      <b-field>
        <b-input placeholder="Password" minlength="1" type="password" required v-model="password"></b-input>
      </b-field>
      <b-button
        :disabled="missingInput"
        type="submit"
        class="button is-fullwidth"
        @click="login()"
      >Login</b-button>
    </div>
    <div v-if="this.$store.getters.isAuthenticated">
      <b-icon icon="account" size="is-small"></b-icon>
      {{this.$store.getters.username}}
      <b-button class="is-fullwidth" @click="logout()">Logout</b-button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { mapGetters } from 'vuex';
import AuthenticationStatus from './AuthenticationStatus';
import AuthenticationStore from './AuthenticationStore';

const authenticationStore = getModule(AuthenticationStore);

@Component({
    computed: mapGetters(['authStatus'])
})
export default class Authentication extends Vue {
    name: string = '';
    password: string = '';

    get missingInput() {
        return this.name.length === 0 || this.password.length === 0;
    }

    login() {
        const { name } = this;
        const { password } = this;
        authenticationStore.login({ name, password });
    }

    logout() {
        this.name = '';
        this.password = '';
        authenticationStore.logout();
    }

    @Watch('authStatus')
    onAuthStatusChanged(status: AuthenticationStatus) {
        let message = '';
        let type = '';
        switch (status) {
        case AuthenticationStatus.In:
            message = 'Login successful.';
            type = 'is-success';
            break;
        case AuthenticationStatus.Out:
            message = 'Logout successful.';
            type = 'is-success';
            break;
        case AuthenticationStatus.Prompt:
            message = 'Please login.';
            type = 'is-warning';
            break;
        case AuthenticationStatus.Error:
            message = 'Login failed!';
            type = 'is-danger';
            break;
        default:
        }
        if (message) this.$toast.open({ message, type });
    }
}
</script>
