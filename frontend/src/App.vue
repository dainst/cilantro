<template>
    <div id="app">
        <link
            rel="stylesheet"
            href="https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css"
        />

        <Navbar></Navbar>

        <router-view id="main_content" />

        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    v{{version}}
                    <small>
                        (
                        <b-tooltip :label="githash">{{githash.substr(0, 7)}}</b-tooltip>)
                    </small>
                </p>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AuthenticationStatus from './authentication/AuthenticationStatus';
import Navbar from './Navbar.vue';

@Component({
    components: {
        Navbar
    }
})
export default class App extends Vue {
    version: string = process.env.VUE_APP_VERSION;
    githash: string = process.env.VUE_APP_GITHASH;
}
</script>

<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    position: relative;
    min-height: 100vh;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

#main_content {
    padding-bottom: 10rem; /* Footer height */
}

footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.5rem; /* Footer height */
}
</style>
