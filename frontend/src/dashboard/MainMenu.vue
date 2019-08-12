<template>
    <div>
        <div v-if="this.$store.getters.isAuthenticated">
            <b-icon icon="account" size="is-small"></b-icon>
            {{this.$store.getters.username}}
            <b-button class="is-fullwidth" @click="authenticationStore.logout()">Logout</b-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { mapGetters } from 'vuex';
import AuthenticationStore from '../authentication/AuthenticationStore';

@Component({
    computed: mapGetters(['authStatus'])
})
export default class MainMenu extends Vue {
    authenticationStore = getModule(AuthenticationStore);
}
</script>
