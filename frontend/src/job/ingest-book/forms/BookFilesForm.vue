<template>
    <div>
        <div class="is-size-4">Staged files:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <FileBrowser :files-to-show="stagedFiles"
            v-bind:initialSelected.sync="selectedFile"/>
        </div>
        <div v-if="isFileSelected">
            {{ selectedFile.name }}
            <b-button @click="saveFile">Add</b-button>
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
    Component, Vue, Prop
} from 'vue-property-decorator';
import { FileParam } from '../BookImportParameters';
import FileBrowser from '@/staging/FileBrowser.vue';
import { getStagingFiles } from '@/util/WorkbenchClient';
import { showError } from '@/util/Notifier.ts';

@Component({
    components: {
        FileBrowser
    }
})
export default class BookFilesForm extends Vue {
    @Prop() private filesParam!: FileParam[]

    labelPosition: String = 'on-border';
    isLoading: boolean = false;

    stagedFiles: File[] = [];
    selectedFile: FileObject = {};

    columns: object[] = [
        {
            field: 'file',
            label: 'Filename'
        }
    ]

    get isFileSelected() {
        return Object.keys(this.selectedFile).length !== 0;
    }

    saveFile() {
        const fileParam: FileParam = {
            file: this.selectedFile.name as string
        };
        this.filesParam.push(fileParam);
        this.$emit('update:filesParam', this.filesParam);
        this.selectedFile = {};
    }

    mounted() {
        this.fetchFiles();
    }

    async fetchFiles() {
        try {
            this.stagedFiles = await getStagingFiles();
        } catch (e) {
            showError("Failed to retrieve file list from server!", this);
            console.error(e);
        }
    }
}

interface FileObject {
    name?: string;
}
</script>
