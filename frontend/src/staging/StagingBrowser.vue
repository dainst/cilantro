<template>
    <section>
        <b-loading :is-full-page="true" :active="operationInProgress"></b-loading>

        <StagingBrowserNav
            :working-directory="workingDirectory"
            :is-file-selected="checkedFiles.length == 0"
            @delete-selected="showDeleteDialog"
            @open-folder="openFolder"
            @create-folder="createFolder"
            @move-selected="showMoveModal"
        />

        <div v-if="filesToShow.length !== 0">
            <b-table
                :data="filesToShow"
                checkable
                hoverable
                :checked-rows="checkedFiles"
                @check="onCheck"
                @click="fileClicked"
            >
                <template slot-scope="props">
                    <b-table-column width="25">
                        <b-icon :icon="getFileIcon(props.row)" />
                    </b-table-column>
                    <b-table-column field="name" label="Name">{{ props.row.name }}</b-table-column>
                </template>
                <template slot="detail" slot-scope="props">
                    <p>{{ props.row.name }}</p>
                </template>
            </b-table>
        </div>
        <div v-else>Folder is empty ...</div>

        <StagingBrowserUpload :working-directory="workingDirectory" @upload-finished="fetchFiles" />
    </section>
</template>

<script lang="ts">
import {
    Component, Prop, Vue
} from 'vue-property-decorator';
import { showSuccess, showWarning, showError } from '@/util/Notifier.ts';
import {
    getStagingFiles, deleteFileFromStaging,
    createFolderInStaging, WorkbenchFile, moveInStaging
} from './StagingClient';
import StagingBrowserNav from './StagingBrowserNav.vue';
import StagingBrowserUpload from './StagingBrowserUpload.vue';
import StagingBrowserFolderSelection from './StagingBrowserFolderSelection.vue';

@Component({
    components: {
        StagingBrowserNav,
        StagingBrowserUpload,
        StagingBrowserFolderSelection
    }
})
export default class StagingBrowser extends Vue {
    @Prop({ required: true }) selectedPaths!: string[];

    operationInProgress: boolean = false;
    workingDirectory: string = '';
    filesToShow: WorkbenchFile[] = [];

    get checkedFiles(): WorkbenchFile[] {
        return this.filesToShow.filter((file) => {
            const path = getFilePath(this.workingDirectory, file.name);
            return this.selectedPaths.includes(path);
        });
    }

    mounted() {
        this.fetchFiles();
    }

    onCheck(checkedFiles: WorkbenchFile[]): void {
        const paths = checkedFiles.map(file => getFilePath(this.workingDirectory, file.name));
        this.$emit('update:selected-paths', paths);
    }

    createFolder(): void {
        this.$buefy.dialog.prompt({
            message: `Enter the folder name or path`,
            inputAttrs: {
                maxlength: 20
            },
            onConfirm: (folderName) => {
                createFolderInStaging(getFilePath(this.workingDirectory, folderName))
                    .then(() => this.fetchFiles());
            }
        });
    }

    async fetchFiles(): Promise<void> {
        try {
            this.operationInProgress = true;
            this.filesToShow = await getStagingFiles(this.workingDirectory);
            this.filesToShow.sort(compareFileEntries);
            this.$emit('files-selected', []);
            this.operationInProgress = false;
        } catch (e) {
            showError('Failed to retrieve file list from server!', e);
        }
    }

    fileClicked(file: WorkbenchFile) {
        if (file.type === 'directory') {
            this.openFolder(`${this.workingDirectory}/${file.name}`);
        }
    }

    openFolder(path: string) {
        this.workingDirectory = path;
        this.fetchFiles();
    }

    showDeleteDialog() {
        this.$buefy.dialog.confirm({
            message: `Delete ${this.checkedFiles.length} items?`,
            onConfirm: this.deleteSelected
        });
    }

    deleteSelected() {
        this.operationInProgress = true;
        const deletions = this.checkedFiles.map((file) => {
            const filePath: string = getFilePath(this.workingDirectory, file.name);
            return deleteFileFromStaging(filePath)
                .catch(e => showError(`Failed to delete ${file.name}!`, e));
        });
        Promise.all(deletions).then(() => {
            this.$emit('update:selected-paths', []);
            this.fetchFiles();
        });
    }

    showMoveModal() {
        this.$buefy.modal.open({
            parent: this,
            component: StagingBrowserFolderSelection,
            events: {
                ok: this.moveSelected
            }
        });
    }

    moveSelected(targetPath: string) {
        this.operationInProgress = true;
        const moveOperations = this.checkedFiles.map((file) => {
            const sourcePath = getFilePath(this.workingDirectory, file.name);
            return moveInStaging(sourcePath, getFilePath(targetPath, file.name))
                .catch(e => showError(`Failed to move ${file.name}!`, e));
        });
        Promise.all(moveOperations).then(() => {
            this.$emit('update:selected-paths', []);
            this.fetchFiles();
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getFileIcon(file: WorkbenchFile) {
        return (file.type === 'directory') ? 'folder' : 'file';
    }
}

export function getFilePath(baseDir: string, filename: string): string {
    return baseDir !== '' ? `${baseDir.slice(1)}/${filename}` : filename;
}

export function getFileName(path: string): string {
    return path.replace(/^.*\//, '');
}

function compareFileEntries(a: WorkbenchFile, b: WorkbenchFile): number {
    if (a.type === 'directory' && b.type !== 'directory') {
        return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
        return 1;
    }
    return 0;
}

</script>
