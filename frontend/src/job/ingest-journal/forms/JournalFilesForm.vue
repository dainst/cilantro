<template>
    <div>
        <div class="is-size-4">Staged files:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <FileBrowser :files-to-show="stagedFiles"
            v-bind:initialSelected.sync="selectedFile"/>
        </div>
        <div v-if="isFileSelected && (selectedFile.name in this.processedPDFs)">
            <div class="is-size-4">Which pages do you want to use of the selected file?</div>
            <b-field grouped>
                <b-field label="Start Page" horizontal>
                    <b-numberinput v-model="pageStart"></b-numberinput>
                </b-field>
                <b-field label="End Page" horizontal>
                    <b-numberinput v-model="pageEnd"></b-numberinput>
                </b-field>
                <b-button @click="saveFileRange">Ok</b-button>
                <b-button @click="cancelFileRange">Cancel</b-button>
            </b-field>
        </div>
        <div v-if="filesParam.length > 0">
            <span class="is-size-4">Files to be processed:</span>
            <b-table :data="filesParam" :columns="columns"  />
        </div>
        <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </div>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import axios from 'axios';
import FileBrowser from '@/staging/FileBrowser.vue';
import { FileRange } from '@/job/ingest-journal/JournalImportParameters';
import ProcessedPDF, { byFilePath } from '@/pdf-processor';
import { getStagingFiles } from '@/util/WorkbenchClient';
import { showError } from '@/util/Notifier.ts';

@Component({
    components: {
        FileBrowser
    }
})
export default class JournalFilesForm extends Vue {
    @Prop() private filesParam!: FileRange[]

    backendUri = this.$store.state.AuthenticationStore.backendUri;
    labelPosition: String = 'on-border';
    stagedFiles: File[] = [];
    isLoading: boolean = false;
    processedPDFs: { [ name: string ] : ProcessedPDF } = {};
    selectedFile: FileObject = {};
    pageStart: number = 1;
    pageEnd: number = -1;
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
        return Object.keys(this.selectedFile).length !== 0;
    }

    saveFileRange() {
        const fileRange: FileRange = {
            file: this.selectedFile.name as string,
            range: [this.pageStart, this.pageEnd]
        };
        this.filesParam.push(fileRange);
        this.$emit('update:filesParam', this.filesParam);
        this.selectedFile = {};
    }

    cancelFileRange() {
        this.selectedFile = {};
    }

    mounted() {
        this.fetchFiles();
    }

    async fetchFiles() {
        try {
            this.stagedFiles = await getStagingFiles();
        } catch (e) {
            showError("Failed to retrieve file list from server!", this, e);
        }
    }

    updateInputs(name: string) {
        this.pageEnd = this.processedPDFs[name].numPages;
    }

    @Watch('selectedFile')
    async onSelectedFileChanged(value: FileObject, oldValue: FileObject) {
        if (value.name === undefined) return;

        if (value.name.toLowerCase().endsWith('.pdf') && !(value.name in this.processedPDFs)) {
            this.isLoading = true;
            const filePath = this.stagedFiles.filter(file => file.name === value.name)[0].name;
            this.processedPDFs[value.name] = await byFilePath(
                `${this.backendUri}/staging/${filePath}`,
                axios.defaults.headers.common.Authorization
            );
            this.isLoading = false;
        }
        this.updateInputs(value.name);
    }
}

interface FileObject {
    name?: string;
}
</script>
