<template>
    <div id="app">
        <link
            rel="stylesheet"
            href="https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css"
        />
        <div id="nav">
            <router-link to="/">Dashboard</router-link>|
            <router-link to="/jobs">Jobs</router-link>|
            <router-link to="/staging">Staging Area</router-link>|
            <router-link to="/ingest-journal">Journal Job</router-link>|
            <router-link to="/ingest-book">Book Job</router-link>
        </div>
        <router-view id="main_content"/>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>This is the Footer....</p>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AuthenticationStatus from './authentication/AuthenticationStatus';

@Component
export default class App extends Vue {
    mounted() {
        this.$store.watch(
            (state, getters) => getters.authStatus,
            (newValue : AuthenticationStatus, oldValue : AuthenticationStatus) => {
                if (newValue === AuthenticationStatus.In) {
                    this.$toast.open({
                        message: 'Login successful.',
                        type: 'is-success'
                    });
                } else if (newValue === AuthenticationStatus.Out) {
                    this.$toast.open({
                        message: 'Logout successful.'
                    });
                } else if (newValue === AuthenticationStatus.Error) {
                    this.$toast.open({
                        message: 'Login failed!',
                        type: 'is-danger'
                    });
                } else if (newValue === AuthenticationStatus.Prompt) {
                    this.$toast.open({
                        message: 'Please login.',
                        type: 'is-warning'
                    });
                }
            }
        );
    }
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
      padding-bottom: 10rem;  /* Footer height */
    }

    footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 0.5rem;     /* Footer height */
    }
</style>
