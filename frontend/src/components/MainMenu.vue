<template>
    <div>
        <Login />
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
import { Component, Vue } from 'vue-property-decorator'
import Login from '@/components/Login.vue'

@Component({
    components: {
        Login
    }
})
export default class MainMenu extends Vue { }
</script>
