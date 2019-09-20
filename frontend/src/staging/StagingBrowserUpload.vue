<template>
    <section>
        <b-modal :active="uploadRunning">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <div
                            class="columns"
                            v-for="(status, filePath) of uploadStatus"
                            :key="filePath"
                        >
                            <div class="column">{{ filePath }}</div>
                            <div class="column">
                                <b-progress
                                    :value="getValue(status)"
                                    show-value
                                    format="percent"
                                    :type="status.complete ? 'is-success' : 'is-primary'"
                                >
                                    <span
                                        v-if="status.percentage >= 100 && !status.complete"
                                    >Postprocessing ...</span>
                                    <span v-if="status.percentage >= 100 && status.complete">
                                        <b-icon icon="check" size="is-small"></b-icon>
                                    </span>
                                </b-progress>
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
import { allowedFileExtensions } from '@/config';

@Component
export default class StagingBrowserUpload extends Vue {
    @Prop({ default: '' }) workingDirectory!: string;

    uploadRunning: boolean = false;
    uploadStatus: { [index: string]: Status } = {};
    filesToUpload: File[] = [];

    uploadFiles() {
        this.uploadRunning = true;
        const uploads = this.filesToUpload.map((file: File) => this.uploadFile(file));
        Promise.all(uploads).then(() => {
            this.filesToUpload = [];
            this.uploadRunning = false;
            this.uploadStatus = {};
            this.$emit('upload-finished');
        });
    }

    async uploadFile(file: File) {
        const ext = file.name.split('.').pop() as string;
        if (!allowedFileExtensions.includes(ext)) {
            showError(`Upload of ${file.name} failed<br>Invalid file extension "${ext}"`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (this.workingDirectory !== '') {
            formData.append('target_folder', this.workingDirectory.slice(1));
        }
        const filePath = getFilePath(this.workingDirectory, file.name);
        const status = this.$set(this.uploadStatus, filePath, { percentage: 0, complete: false });
        try {
            const response: any = await uploadFileToStaging(formData,
                this.updateUploadPercentage(filePath));
            this.$set(this.uploadStatus, filePath, { percentage: 100, complete: true });
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
            this.$set(this.uploadStatus, filePath, { percentage, complete: false });
        };
    }

    getValue = getValue;
}

interface Status {
    percentage: number;
    complete: boolean;
}

function getValue(status: Status) {
    if (status.percentage >= 100 && !status.complete) return undefined;
    return status.percentage;
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
