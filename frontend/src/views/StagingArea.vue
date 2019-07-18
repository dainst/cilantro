<template>
    <div>
        <h2>File Browser</h2>
        <FileBrowser files="files"/>
        <h2>Upload File</h2>
        <UploadFiles/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadFiles from '@/components/UploadFiles.vue'
import FileBrowser from '@/components/FileBrowser.vue'

@Component({
    components: {
        FileBrowser,
        UploadFiles
    }
})
export default class StagingArea extends Vue {

}
</script>
