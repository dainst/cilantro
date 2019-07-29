<template>
    <div>
        <h2>File Browser</h2>
        <FileBrowser :files-to-show="stagedFiles"/>
        <h2>Upload File</h2>
        <UploadFiles :running="running" :uploadedFiles="numberOfProcessedFiles"
                     :totalFiles="numberOfFilesToUpload" @uploadTriggered="uploadFiles"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import UploadFiles from '@/staging/UploadFiles.vue';
import FileBrowser from '@/staging/FileBrowser.vue';

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

        fetchFiles() {
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

        uploadFiles(filesToUpload: File[]) {
            this.running = true;
            this.filesToUpload = filesToUpload;
            for (let file of filesToUpload) {
                this.uploadFile(file);
            }
        }

        uploadFile(file: File) {
            const ext = file.name.split('.').pop();
            if (ext !== 'csv' && ext !== 'pdf') {
                this.$snackbar.open({
                    message: `Upload of ${file.name} failed, invalid file extension ${ext}`,
                    type: 'is-danger',
                    queue: false
                });
                this.uploadFailedFiles.push(file);
                this.checkUploadStatus();
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            axios.post(`${this.$store.state.backendURI}staging`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(() => {
                this.$snackbar.open({
                    message: `Upload of ${file.name} successful!`,
                    queue: false
                });
                this.uploadSuccessFiles.push(file);
                this.checkUploadStatus();
            }).catch((error) => {
                console.error('An Error occurred while uploading file', file.name, error);
                this.$snackbar.open({
                    message: `Upload of ${file.name} failed!`,
                    type: 'is-danger',
                    queue: false
                });
                this.uploadFailedFiles.push(file);
                this.checkUploadStatus();
            });
        }

        checkUploadStatus() {
            if (this.numberOfFilesToUpload !== this.numberOfProcessedFiles) return;

            this.fetchFiles();
            if (this.uploadFailedFiles.length === 0) {
                this.$toast.open({
                    message: 'Upload of all files succeeded',
                    type: 'is-success',
                    queue: false
                });
            } else {
                this.$toast.open({
                    message: `Upload of ${this.uploadFailedFiles.length} files failed`,
                    type: 'is-success',
                    queue: false
                });
            }
            this.filesToUpload = [];
            this.uploadSuccessFiles = [];
            this.uploadFailedFiles = [];
            this.running = false;
        }
}
</script>
