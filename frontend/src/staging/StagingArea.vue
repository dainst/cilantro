<template>
    <div>
        <FileBrowser />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import FileBrowser from './FileBrowser.vue';
import {
    getStagingFiles, uploadFileToStaging, deleteFileFromStaging, createFolderInStaging
} from './StagingClient';

@Component({
    components: {
        FileBrowser
    }
})
export default class StagingArea extends Vue {
    @Provide() fetchFunction = getStagingFiles
    @Provide() uploadFunction = uploadFileToStaging
    @Provide() deleteFunction = deleteFileFromStaging
    @Provide() createFolderFunction = createFolderInStaging
}
</script>
