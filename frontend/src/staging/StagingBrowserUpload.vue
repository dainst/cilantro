<template>
    <section>
        <b-modal :active="uploadRunning">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <div
                            class="columns"
                            v-for="(percentage, filePath) of uploadPercentage"
                            :key="filePath"
                        >
                            <div class="column">{{ filePath }}</div>
                            <div class="column">
                                <b-progress
                                    :value="percentage"
                                    show-value
                                    format="percent"
                                    :type="percentage >= 100 ? 'is-success' : 'is-primary'"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-field>
            <b-upload
                multiple
                drag-drop
                v-if="!uploadRunning"
                v-model="filesToUpload"
                @input="uploadFiles"
            >
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
    </section>
</template>

<script lang="ts">
import {
    Component, Prop, Vue
} from 'vue-property-decorator';
import { showError } from '@/util/Notifier';
import { getFilePath } from './StagingBrowser.vue';
import { uploadFileToStaging } from './StagingClient';

@Component
export default class StagingBrowserUpload extends Vue {
    @Prop({ default: '' }) workingDirectory!: string;

    uploadRunning: boolean = false;
    uploadPercentage: { [index: string]: number } = {};
    filesToUpload: File[] = [];

    uploadFiles() {
        this.uploadRunning = true;
        const uploads = this.filesToUpload.map((file: File) => this.uploadFile(file));
        Promise.all(uploads).then(() => {
            this.filesToUpload = [];
            this.uploadRunning = false;
            this.uploadPercentage = {};
            this.$emit('upload-finished');
        });
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
        const filePath = getFilePath(this.workingDirectory, file.name);
        this.$set(this.uploadPercentage, filePath, 0);
        try {
            const response: any = await uploadFileToStaging(formData, this.updateUploadPercentage(filePath));
            if (!response.result[filePath].success) {
                showError(`Upload of ${filePath} failed!<br>${response.result[filePath].error.message}`,
                    response.result[filePath].error.message);
            }
        } catch (e) {
            showError(`Upload of ${filePath} failed!`, e);
        }
    }

    updateUploadPercentage(filePath: string) {
        return (percentage: number) => {
            this.$set(this.uploadPercentage, filePath, percentage);
        };
    }
}
</script>

<style lang="scss">
.upload {
    width: 100%;

    .upload-draggable {
        width: 100%;

        &.is-loading {
            padding: 2.5rem;
        }
    }

    .section {
        padding: 1rem;
    }
}
</style>
