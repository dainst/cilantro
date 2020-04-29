<template>
    <section>
        <b-loading :is-full-page="true" :active="operationInProgress"></b-loading>

        <b-navbar>
            <template slot="start">
                <StagingBrowserNav
                    :working-directory="workingDirectory"
                    :is-file-selected="checkedFiles.length == 0"
                    @delete-selected="showDeleteDialog"
                    @open-folder="openFolder"
                    @create-folder="createFolder"
                    @move-selected="showMoveModal"
                />
            </template>
            <template slot="end">
            <b-switch v-model="showMarked">
                Show completed tasks
            </b-switch>
            </template>
        </b-navbar>
        <div v-if="getFilesToShow().length !== 0">
            <b-table
                :data="getFilesToShow()"
                checkable
                hoverable
                :checked-rows="checkedFiles"
                @check="onCheck"
                @click="fileClicked"
            >
                <template slot-scope="props" >
                    <b-table-column width="25">
                        <b-icon :icon="getFileIcon(props.row)"/>
                    </b-table-column>

                    <b-table-column field="name" label="Name">{{ props.row.name }}</b-table-column>

                    <b-table-column field="marked">
                        <b-icon icon="check" type="is-success" v-if="props.row.marked"></b-icon>
                    </b-table-column>

                    <b-table-column field="edit" label="" width="25" @click.native.stop>
                        <b-dropdown aria-role="list">
                            <b-button icon-right="dots-vertical" type="is-text" slot="trigger"/>
                            <b-dropdown-item aria-role="listitem" @click="showRenameModal(props.row)">
                                <div class="media">
                                    <b-icon class="media-left" icon="folder-edit"/>
                                    <div class="media-content">Rename</div>
                                </div>
                            </b-dropdown-item>
                            <b-dropdown-item aria-role="listitem" @click="showMoveModalForItem(props.row)">
                                <div class="media">
                                    <b-icon class="media-left" icon="folder-move"/>
                                    <div class="media-content">Move</div>
                                </div>
                            </b-dropdown-item>
                            <b-dropdown-item aria-role="listitem" @click="showDeleteDialogForItem(props.row)">
                                <div class="media">
                                    <b-icon class="media-left" icon="delete"/>
                                    <div class="media-content">Delete</div>
                                </div>
                            </b-dropdown-item>
                        </b-dropdown>
                    </b-table-column>

                </template>
                <template slot="detail" slot-scope="props">
                    <p>{{ props.row.name }}</p>
                </template>
            </b-table>
        </div>
        <div v-else>Folder is empty ...</div>
        <StagingBrowserUpload :working-directory="workingDirectory" @upload-finished="fetchFiles" :accepted-filetypes="acceptedFiletypes"/>
    </section>
</template>

<script lang="ts">
import {
    Component, Prop, Vue
} from 'vue-property-decorator';
import { showSuccess, showWarning, showError } from '@/util/Notifier.ts';
import {
    getStagingFiles,
    deleteFileFromStaging,
    createFolderInStaging,
    WorkbenchFile,
    moveInStaging,
    WorkbenchFileTree,
    getVisibleFolderContents
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
    @Prop({ required: true }) acceptedFiletypes!: string;

    operationInProgress: boolean = false;
    workingDirectory: string = '';
    stagingFiles: WorkbenchFileTree = {};
    filesToShow: WorkbenchFile[] = [];
    showMarked: boolean = false;

    get checkedFiles(): WorkbenchFile[] {
        return this.filesToShow.filter((file) => {
            const path = getFilePath(this.workingDirectory, file.name);
            return this.selectedPaths.includes(path);
        });
    }

    mounted() {
        this.fetchFiles();
    }

    async onCheck(checkedFiles: WorkbenchFile[]): Promise<void> {
        const paths = checkedFiles.map(file => getFilePath(this.workingDirectory, file.name));
        this.$emit('update:selected-paths', paths);
    }

    createFolder(): void {
        this.$buefy.dialog.prompt({
            message: `Enter the folder name or path`,
            inputAttrs: {
                maxlength: 100
            },
            onConfirm: (folderName) => {
                createFolderInStaging(getFilePath(this.workingDirectory, folderName))
                    .then(() => this.fetchFiles())
                    .catch(e => showError('Failed to create folder!', e));
            }
        });
    }

    async fetchFiles(): Promise<void> {
        try {
            this.operationInProgress = true;
            this.stagingFiles = await getStagingFiles();
            this.filesToShow = getFilesInWorkDir(this.stagingFiles, this.workingDirectory);
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
        this.filesToShow = getFilesInWorkDir(this.stagingFiles, this.workingDirectory);
    }

    showDeleteDialogForItem(file: WorkbenchFile) {
        this.onCheck([file]).then(() => {
            this.showDeleteDialog();
        });
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

    showRenameModal(file: WorkbenchFile) {
        this.onCheck([file]).then(() => {
            this.$buefy.dialog.prompt({
                message: `Choose a new name`,
                inputAttrs: {
                    value: file.name,
                    placeholder: 'name',
                    maxlength: 40
                },
                onConfirm: value => this.renameSelected(value)
            });
        });
    }

    renameSelected(value: string) {
        this.operationInProgress = true;
        const moveOperations = this.checkedFiles.map((file) => {
            const sourcePath = getFilePath(this.workingDirectory, file.name);
            return moveInStaging(sourcePath, getFilePath(this.workingDirectory, value))
                .catch(e => showError(`Failed to rename ${file.name}!`, e));
        });
        Promise.all(moveOperations).then(() => {
            this.$emit('update:selected-paths', []);
            this.fetchFiles();
        });
    }

    showMoveModalForItem(file: WorkbenchFile) {
        this.onCheck([file]).then(() => {
            this.showMoveModal();
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

    getFilesToShow() {
        if (this.showMarked) {
            return this.filesToShow;
        }
        return this.filesToShow.filter(file => !file.marked);
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

export function getFilesInWorkDir(files: WorkbenchFileTree, workDir: string): WorkbenchFile[] {
    const splitPath: string[] = workDir.split('/');
    let contents = files;
    splitPath.slice(1).forEach((dir: string) => {
        contents = contents[dir].contents || {};
    });
    return Object.values(getVisibleFolderContents(contents)).sort(compareFileEntries);
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
