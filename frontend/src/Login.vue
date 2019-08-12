<template>
<div>
    <div class="columns is-centered">
        <div class="column is-size-4">Please login</div>
    </div>
    <div class="columns is-centered">
        <form class="column is-narrow login" @submit.prevent="login">
            <b-field>
                <b-input
                    placeholder="Name"
                    minlength="1"
                    type="text"
                    required
                    v-model="name"
                ></b-input>
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
        </form>
    </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { mapGetters } from 'vuex';
import AuthenticationStatus from './authentication/AuthenticationStatus';
import AuthenticationStore from './authentication/AuthenticationStore';

@Component({
    computed: mapGetters(['authStatus'])
})
export default class Login extends Vue {
    name: string = '';
    password: string = '';

    authenticationStore = getModule(AuthenticationStore);

    get missingInput() {
        return this.name.length === 0 || this.password.length === 0;
    }

    login() {
        const { name } = this;
        const { password } = this;
        this.authenticationStore.login({ name, password });
    }

    toastTheToast(status: AuthenticationStatus) {
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

    @Watch('authStatus')
    onAuthStatusChanged(status: AuthenticationStatus) {
        this.toastTheToast(status);
        if (status === AuthenticationStatus.In) {
            this.$route.params.back
                ? this.$router.push({ path: this.$route.params.back })
                : this.$router.push({ path: '/' });
        }
    }
}
</script>
