<template>
    <div v-if="isAuthentificated">
        <h3 class="is-size-5">Running jobs</h3>
        <progress class="progress is-primary" value="15" max="100">15%</progress>
        <progress class="progress is-link" value="30" max="100">30%</progress>
        <progress class="progress is-info" value="45" max="100">45%</progress>
        <progress class="progress is-success" value="60" max="100">60%</progress>
        <progress class="progress is-warning" value="75" max="100">75%</progress>
        <progress class="progress is-danger" value="90" max="100">90%</progress>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RunningJobsList extends Vue {
    get isAuthentificated() {
        return this.$store.state.authentification.authentificated;
    }
}
</script>
