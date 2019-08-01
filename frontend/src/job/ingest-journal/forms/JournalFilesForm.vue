<template>
    <div class="tile is-ancestor">
        <FileBrowser :files-to-show="stagedFiles" v-bind:initialSelected.sync="selectedFile"/>
        <div v-if="isFileSelected" class="tile is-parent">
            <span class="tile is-child">
                {{ selectedFile.name }}
            </span>
            <b-field label="Start Page" :label-position="labelPosition" class="tile is-child">
                <b-input v-model="pageStart"></b-input>
            </b-field>
            <b-field label="End Page" :label-position="labelPosition" class="tile is-child">
                <b-input v-model="pageEnd"></b-input>
            </b-field>
            <b-button class="tile is-child" @click="saveFileRange">Save</b-button>
            <b-button class="tile is-child" @click="cancelFileRange">Cancel</b-button>
        </div>
        <div v-if="addedFiles.length > 0" class="tile is-parent">
            Selected files:
            <b-table :data="addedFiles" :columns="columns" class="tile is-child" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import axios from 'axios';
import FileBrowser from '@/staging/FileBrowser.vue';
import { FileRange } from '@/job/ingest-journal/JobParameters';

@Component({
    components: {
        FileBrowser
    }
})
export default class JournalFilesForm extends Vue {
    @Prop() private filesParam!: FileRange[]

    labelPosition: String = 'on-border';

    stagedFiles: File[] = []
    selectedFile: FileObject = {};
    pageStart: number = 0;
    pageEnd: number = 0;
    addedFiles: FileRange[] = [];
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
        this.addedFiles.push(fileRange);
        this.selectedFile = {};
    }

    cancelFileRange() {
        this.selectedFile = {};
    }

    mounted() {
        this.fetchFiles();
    }

    fetchFiles() { // TODO refactor 'then'
        axios.get(
            `${this.$store.state.backendURI}staging`
        ).then((response) => {
            this.stagedFiles = response.data;
        }).catch((error) => {
            if (error.response === undefined) {
                console.log('Application Error', error);
            } else {
                console.log('Invalid Server Response:', error.response);
            }
            this.$toast.open({
                message: 'No filesToShow fetched from Backend',
                type: 'is-danger',
                queue: false
            });
        });
    }
}

interface FileObject {
    name?: string;
}
</script>

<style scoped lang="scss">

</style>
