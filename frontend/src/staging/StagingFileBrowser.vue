<template>
    <section>
        <b-field>
            <b-upload v-model="filesToUpload" multiple drag-drop @input="uploadFiles">
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon icon="upload" size="is-large"></b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                    </div>
                </section>
            </b-upload>
        </b-field>
        <p>
            <span v-if="uploadRunning">Upload in progress!</span>
        </p>

        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <nav class="breadcrumb">
                        <ul>
                            <li
                                v-for="(dir, index) in workingDirectoryArray"
                                :key="index + dir"
                                :class="{ 'is-active': index >= workingDirectoryArray.length - 1}"
                            >
                                <a
                                    @click="openFolder(workingDirectoryArray.slice(0, index + 1).join('/'))"
                                >
                                    <b-icon icon="home" v-if="index == 0"></b-icon>
                                    <span v-if="index > 0">{{ dir }}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="level-item">
                    <b-tooltip label="Create folder">
                        <b-button type="is-text" icon-right="folder-plus" @click="createFolder()"></b-button>
                    </b-tooltip>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <b-tooltip label="Remove selected">
                        <b-button type="is-danger" icon-right="delete" @click="deleteSelected()"></b-button>
                    </b-tooltip>
                </div>
            </div>
        </div>

        <div v-if="filesToShow.length !== 0">
            <b-table
                :data="filesToShow"
                checkable
                hoverable
                :checked-rows="checkedFiles"
                @check="onCheck"
                @click="$event.type === 'directory' && openFolder(workingDirectory + '/' + $event.name)"
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
        <div v-else>No files found!</div>
    </section>
</template>

<script lang="ts">
import {
    Component, Prop, Vue, Watch
} from 'vue-property-decorator';
import { showSuccess, showWarning, showError } from '@/util/Notifier.ts';
import {
    getStagingFiles, uploadFileToStaging, deleteFileFromStaging,
    createFolderInStaging, WorkbenchFile
} from './StagingClient';

@Component
export default class StagingFileBrowser extends Vue {
    @Prop({ default: () => [] }) selectedFiles!: string[];

    workingDirectory: string = '';
    filesToShow: WorkbenchFile[] = [];
    uploadRunning: boolean = false;
    filesToUpload: File[] = [];

    get checkedFiles(): WorkbenchFile[] {
        return this.filesToShow.filter(file => this.selectedFiles.includes(file.name));
    }

    get workingDirectoryArray(): string[] {
        return this.workingDirectory.split('/');
    }

    mounted() {
        this.fetchFiles();
    }

    onCheck(checkedFiles: WorkbenchFile[]): void {
        const basePath = (this.workingDirectory) ? `${this.workingDirectory}/` : '';
        this.$emit('files-selected', checkedFiles.map(file => `${basePath}${file.name}`));
    }

    createFolder(): void {
        this.$buefy.dialog.prompt({
            message: `Enter the folder name or path`,
            inputAttrs: {
                maxlength: 20
            },
            onConfirm: (folderName) => {
                createFolderInStaging(this.getFilePath(folderName)).then(() => this.fetchFiles());
            }
        });
    }

    async fetchFiles(): Promise<void> {
        try {
            this.filesToShow = await getStagingFiles(this.workingDirectory);
            this.filesToShow.sort(compareFileEntries);
            this.$emit('files-selected', []);
        } catch (e) {
            showError('Failed to retrieve file list from server!', e);
        }
    }

    openFolder(path: string) {
        this.workingDirectory = path;
        this.fetchFiles();
    }

    uploadFiles() {
        this.uploadRunning = true;
        this.filesToUpload.forEach((file: File) => {
            this.uploadFile(file);
        });
        this.filesToUpload = [];
        this.uploadRunning = false;
    }

    async uploadFile(file: File) {
        const allowedExtensions: string[] = process.env.VUE_APP_ALLOWED_FILE_EXTENSIONS.split(', ');
        const ext = file.name.split('.').pop() as string;
        if (!allowedExtensions.includes(ext)) {
            showError(`Upload of ${file.name} failed<br>Invalid file extension "${ext}"`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (this.workingDirectory !== '') {
            formData.append('target_folder', this.workingDirectory.slice(1));
        }
        const filePath = this.getFilePath(file.name);
        try {
            const response: any = await uploadFileToStaging(formData);
            if (response.result[filePath].success) {
                showSuccess(`Upload of ${filePath} successful!`);
                this.fetchFiles();
            } else {
                showError(`Upload of ${filePath} failed!<br>${response.result[filePath].error.message}`,
                    response.result[filePath].error.message);
            }
        } catch (e) {
            showError(`Upload of ${filePath} failed!`, e);
        }
    }

    deleteSelected() {
        this.$buefy.dialog.confirm({
            message: `Delete ${this.checkedFiles.length} items?`,
            onConfirm: () => {
                const deletions = this.checkedFiles.map((file) => {
                    const filePath: string = this.getFilePath(file.name);
                    return deleteFileFromStaging(filePath)
                        .catch(e => showError(`Failed to delete ${file.name}!`, e));
                });
                Promise.all(deletions).then(() => this.fetchFiles());
            }
        });
    }

    getFilePath(filename: string): string {
        return this.workingDirectory !== '' ? `${this.workingDirectory.slice(1)}/${filename}` : filename;
    }

    // eslint-disable-next-line class-methods-use-this
    getFileIcon(file: WorkbenchFile) {
        return (file.type === 'directory') ? 'folder' : 'file';
    }
}

function convertArrayToObject(arr: any[]) {
    const obj = arr.reduce((acc, cur, i) => {
        acc[cur.name] = cur; // eslint-disable-line no-param-reassign
        return acc;
    }, {});
    return obj;
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
