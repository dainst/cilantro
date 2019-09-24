<template>
    <div class="container">
        <StagingBrowser :selected-paths.sync="selectedPaths" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StagingBrowser from './StagingBrowser.vue';

@Component({
    components: {
        StagingBrowser
    }
})
export default class StagingArea extends Vue {
    selectedPaths: string[] = [];
}
</script>
