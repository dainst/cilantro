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
        <div>Active directory: /{{workingDirectory}}</div>
        <b-button icon-right="folder-plus" @click="createFolder()">New folder</b-button>
        <div v-if="filesToShow.length !== 0">
            <b-table
                :data="filesToShow"
                checkable
                :checked-rows="checkedFiles"
                v-on:check="onCheck"
            >
                <template slot-scope="props">
                    <b-table-column>
                        <b-button
                            v-if="props.row.type === 'directory'"
                            v-bind:icon-right="getFolderIcon(props.row)"
                            @click.stop="openFolder(props.row.name)"
                        />
                    </b-table-column>
                    <b-table-column field="name" label="Filename">{{ props.row.name }}</b-table-column>
                    <b-table-column label="Type">{{ props.row.type }}</b-table-column>
                    <b-table-column label>
                        <b-button
                            v-if="props.row.name !== parentFolderName"
                            icon-right="delete"
                            @click="deleteFile(props.row)"
                        />
                    </b-table-column>
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

const parentFolderName: string = '..';

@Component
export default class StagingFileBrowser extends Vue {
    @Prop() selectedFiles!: string[];

    // needs to be on component to be usable in template
    parentFolderName: string = parentFolderName;
    getFolderIcon: Function = getFolderIcon;
    workingDirectory: string = '';
    filesToShow: WorkbenchFile[] = [];
    uploadRunning: boolean = false;
    filesToUpload: File[] = [];

    get checkedFiles() {
        return this.filesToShow.filter(file => this.selectedFiles.includes(file.name));
    }

    onCheck(checkedFiles: WorkbenchFile[]) {
        this.$emit('files-selected', checkedFiles.map(file => file.name));
    }

    createFolder(folderPath: string) {
        this.$buefy.dialog.prompt({
            message: `Enter the folder name or path`,
            inputAttrs: {
                maxlength: 20
            },
            onConfirm: (folderName) => {
                createFolderInStaging(this.getFilePath(folderName));
                this.fetchFiles();
            }
        });
    }

    mounted() {
        this.fetchFiles();
    }

    async fetchFiles() {
        try {
            this.filesToShow = await getStagingFiles();
            this.filesToShow.sort(compareFileEntries);

            // go to original folder
            const oldWorkingDir = this.workingDirectory;
            const folderArray = this.workingDirectory.split('/');
            folderArray.shift(); // ignore root folder
            folderArray.forEach((item) => {
                this.openFolder(item);
            });
            this.workingDirectory = oldWorkingDir;
        } catch (e) {
            showError('Failed to retrieve file list from server!', e);
        }
    }

    openFolder(folderName: string) {
        const oldWorkingDir: WorkbenchFile[] = this.filesToShow;
        const dir =
            this.filesToShow.find(element => element.name === folderName) || { contents: [] };
        this.filesToShow = dir.contents as WorkbenchFile[];
        const isParentFolderPresent =
            this.filesToShow.find(element => element.name === parentFolderName) !== undefined;

        if (folderName !== parentFolderName) {
            this.workingDirectory += `/${folderName}`;

            if (!isParentFolderPresent) {
                const parentFolder = {
                    name: parentFolderName,
                    type: 'directory',
                    contents: oldWorkingDir
                } as WorkbenchFile;
                this.filesToShow.push(parentFolder);
            }
        } else {
            this.workingDirectory = this.workingDirectory.slice(0, this.workingDirectory.lastIndexOf('/'));
        }
        this.filesToShow.sort(compareFileEntries);
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

    deleteFile(file: WorkbenchFile) {
        this.$buefy.dialog.confirm({
            message: file.type === 'file' ? 'Delete file?' : 'Delete folder?',
            onConfirm: async () => {
                try {
                    const filePath: string = this.getFilePath(file.name);
                    await deleteFileFromStaging(filePath);
                    showSuccess(`${filePath} deleted!`);
                    this.fetchFiles();
                } catch (e) {
                    showError('Failed to delete file!', e);
                }
            }
        });
    }

    getFilePath(filename: string): string {
        return this.workingDirectory !== '' ? `${this.workingDirectory.slice(1)}/${filename}` : filename;
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
    if (a.name === parentFolderName) {
        return -1;
    }
    if (b.name === parentFolderName) {
        return 1;
    }
    if (a.type === 'directory' && b.type !== 'directory') {
        return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
        return 1;
    }
    return 0;
}

function getFolderIcon(folder: any): string {
    return folder.name === parentFolderName ? 'folder-upload' : 'folder-open';
}
</script>
