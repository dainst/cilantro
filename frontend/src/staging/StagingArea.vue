<template>
    <div>
        <h2>File Browser</h2>
        <FileBrowser :files-to-show="stagedFiles" />
        <h2>Upload File</h2>
        <UploadFiles
            :running="running"
            :uploadedFiles="numberOfProcessedFiles"
            :totalFiles="numberOfFilesToUpload"
            @uploadTriggered="uploadFiles"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import UploadFiles from './UploadFiles.vue';
import FileBrowser from './FileBrowser.vue';
import { getStagingFiles, uploadFileToStaging } from '@/util/WorkbenchClient';
import { showSuccess, showError } from '@/util/Notifier.ts';

@Component({
    components: {
        FileBrowser,
        UploadFiles
    }
})
export default class StagingArea extends Vue {
    stagedFiles: File[] = []
    filesToUpload: File[] = []

    uploadSuccessFiles: File[] = []
    uploadFailedFiles: File[] = []
    running: boolean = false

    mounted() {
        this.fetchFiles();
    }

    get numberOfFilesToUpload() {
        return this.filesToUpload.length;
    }

    get numberOfProcessedFiles() {
        return this.uploadFailedFiles.length + this.uploadSuccessFiles.length;
    }

    async fetchFiles() {
        try {
            this.stagedFiles = await getStagingFiles();
        } catch (e) {
            showError("Failed to retrieve file list from server!", this, e);
        }
    }

    uploadFiles(filesToUpload: File[]) {
        this.running = true;
        this.filesToUpload = filesToUpload;
        for (const file of filesToUpload) {
            this.uploadFile(file);
        }
    }

    async uploadFile(file: File) {
        const allowedExtensions: string[] = process.env.VUE_APP_ALLOWED_FILE_EXTENSIONS.split(', ');
        const ext = file.name.split('.').pop() as string;
        if (!allowedExtensions.includes(ext)) {
            showError(`Upload of ${file.name} failed, invalid file extension ${ext}`, this);
            this.uploadFailedFiles.push(file);
            this.checkUploadStatus();
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadFileToStaging(formData);
            showSuccess(`Upload of ${file.name} successful!`, this);
            this.uploadSuccessFiles.push(file);
        } catch (e) {
            showError(`Upload of ${file.name} failed!`, this, e);
            this.uploadFailedFiles.push(file);
        }
        this.checkUploadStatus();
    }

    checkUploadStatus() {
        if (this.numberOfFilesToUpload !== this.numberOfProcessedFiles) return;

        this.fetchFiles();
        if (this.uploadFailedFiles.length === 0) {
            showSuccess('Upload of all files succeeded', this);
        } else {
            showError(`Upload of ${this.uploadFailedFiles.length} files failed`, this);
        }
        this.filesToUpload = [];
        this.uploadSuccessFiles = [];
        this.uploadFailedFiles = [];
        this.running = false;
    }
}
</script>
