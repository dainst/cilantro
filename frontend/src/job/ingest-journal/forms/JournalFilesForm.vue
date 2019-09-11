<template>
    <div>
        <div class="is-size-4">Staged files:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <StagingFileBrowser v-on:file-selected="selectedFile = $event" />
        </div>
        <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import axios from 'axios';
import StagingFileBrowser from '@/staging/StagingFileBrowser.vue';
import ProcessedPDF, { byFilePath } from '@/pdf-processor';
import {
    getStagingFiles, uploadFileToStaging, deleteFileFromStaging,
    createFolderInStaging, WorkbenchFile
} from '@/staging/StagingClient';
import { showError } from '@/util/Notifier.ts';

@Component({
    components: {
        StagingFileBrowser
    }
})
export default class JournalFilesForm extends Vue {
    @Prop() private files!: string[]

    backendUri = this.$store.state.AuthenticationStore.backendUri;
    labelPosition: String = 'on-border';
    stagedFiles: WorkbenchFile[] = [];
    isLoading: boolean = false;
    processedPDFs: { [name: string]: ProcessedPDF } = {};

    selectedFile: File = {} as File;

    columns: object[] = [
        {
            field: 'file',
            label: 'Filename'
        },
        {
            field: 'range',
            label: 'Page Range'
        }
    ]

    get isFileSelected() {
        return Object.keys(this.selectedFile).length !== 0 && this.selectedFile.type !== 'directory';
    }

    mounted() {
        this.fetchFiles();
    }

    async fetchFiles() {
        try {
            this.stagedFiles = await getStagingFiles();
        } catch (e) {
            showError('Failed to retrieve file list from server!', e);
        }
    }
}
</script>
