<template>
    <div>
        <StagingFileBrowser />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import StagingFileBrowser from './StagingFileBrowser.vue';

@Component({
    components: {
        StagingFileBrowser
    }
})
export default class StagingArea extends Vue {

}
</script>
