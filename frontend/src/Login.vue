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
                        id="username"
                    ></b-input>
                </b-field>
                <b-field>
                    <b-input
                        placeholder="Password"
                        minlength="1"
                        type="password"
                        required
                        v-model="password"
                        id="password"
                    ></b-input>
                </b-field>
                <b-button
                    :disabled="missingInput"
                    native-type="submit"
                    class="button is-fullwidth"
                    @click="login()"
                    id="submit"
                >Login</b-button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable class-methods-use-this */
import { Component, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { mapGetters } from 'vuex';
import AuthenticationStatus from './authentication/AuthenticationStatus';
import AuthenticationStore from './authentication/AuthenticationStore';
import { showError } from '@/util/Notifier.ts';

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

    @Watch('authStatus')
    onAuthStatusChanged(status: AuthenticationStatus) {
        if (status === AuthenticationStatus.Error) {
            showError('Login failed');
        } else if (status === AuthenticationStatus.In) {
            if (this.$route.params.back) {
                this.$router.push({ path: this.$route.params.back, query: this.$route.query });
            } else if (this.$route.path !== '/') {
                this.$router.push({ path: '/' });
            }
        }
    }
}
</script>
