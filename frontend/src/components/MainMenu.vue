<template>
    <div>
        <b-button class="is-fullwidth" v-if="!isAuthentificated" @click="login()">Login</b-button>
        <b-button class="is-fullwidth" v-if="isAuthentificated" @click="logout()">Logout</b-button>
        <br>
        <b-menu>
            <b-menu-list label="Menu">
                <b-menu-item icon="information-outline" label="Info"></b-menu-item>
                <b-menu-item icon="settings" active expanded>
                    <template slot="label" slot-scope="props">
                        Administrator
                        <b-icon
                            class="is-pulled-right"
                            :icon="props.expanded ? 'menu-down' : 'menu-up'">
                        </b-icon>
                    </template>
                    <b-menu-item icon="account" label="Users"></b-menu-item>
                    <b-menu-item icon="cellphone-link" label="Devices"></b-menu-item>
                    <b-menu-item icon="cash-multiple" label="Payments" disabled></b-menu-item>
                </b-menu-item>
                <b-menu-item icon="account" label="My Account">
                    <b-menu-item label="Account data"></b-menu-item>
                    <b-menu-item label="Addresses"></b-menu-item>
                </b-menu-item>
            </b-menu-list>
            <b-menu-list>
                <b-menu-item
                    label="Expo"
                    icon="link"
                    tag="router-link"
                    target="_blank"
                    to="/expo">
                </b-menu-item>
            </b-menu-list>
        </b-menu>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
@Component
export default class MainMenu extends Vue {
    get isAuthentificated () {
        return this.$store.state.authentification.authentificated
    };
    login() {
        this.$store.commit({
            type: 'login',
            name: 'u',
            password: 'p'
        })

    };
    logout(){
        this.$store.commit({
            type: 'logout'
        })
    }
}
</script>
