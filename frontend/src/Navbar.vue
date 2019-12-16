<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" to="/">
                <strong>iDAI.workbench</strong>
            </b-navbar-item>
        </template>

        <template slot="start" v-if="isAuthenticated">
            <b-navbar-item tag="router-link" to="/">
                <b-icon icon="monitor-dashboard"></b-icon>&nbsp;&nbsp;Dashboard
            </b-navbar-item>
            <b-navbar-item tag="router-link" to="/jobs">
                <b-icon icon="timer"></b-icon>&nbsp;&nbsp;Job Monitor
            </b-navbar-item>
            <b-navbar-item tag="router-link" to="/staging">
                <b-icon icon="folder-upload"></b-icon>&nbsp;&nbsp;Staging Area
            </b-navbar-item>
        </template>

        <template slot="end" v-if="isAuthenticated">
            <b-navbar-item tag="div">
                <b-dropdown>
                    <button class="button is-light" slot="trigger">
                        <b-icon icon="account"></b-icon>
                        {{username}}
                        <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item @click="logout()">
                        <b-icon icon="logout" size="is-small"></b-icon>Logout
                    </b-dropdown-item>
                </b-dropdown>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapActions } from 'vuex';

@Component({
    computed: mapGetters(['isAuthenticated', 'username']),
    methods: {
        ...mapActions(['logout'])
    }
})
export default class Navbar extends Vue { }
</script>
