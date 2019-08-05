<template>
    <section v-show="this.$store.getters.isAuthenticated">
        <b-field>
            <b-upload v-model="filesToUpload"
                      multiple
                      drag-drop>
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon icon="upload"
                                    size="is-large">
                            </b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                    </div>
                </section>
            </b-upload>
        </b-field>

        <h3>Selected Files:</h3>
        <span v-if="filesToUpload.length === 0">Select a file to upload</span>
        <div class="tags section">
            <span v-for="(file, index) in filesToUpload"
                  class="tag is-primary">
                {{file.name}}
                <button class="delete is-small"
                        type="button"
                        @click="deleteFileToUpload(index)">
                </button>
            </span>
        </div>
        <b-button @click="upload" :disabled="running || filesToUpload.length === 0">
            Upload
        </b-button>
        <p>
            <span v-if="running">Upload is running! {{uploadedFiles}} of {{totalFiles}} uploaded</span>
        </p>
    </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class UploadFiles extends Vue {
        filesToUpload: File[] = []
        @Prop() running!: boolean
        @Prop() uploadedFiles!: number
        @Prop() totalFiles!: number

        deleteFileToUpload(index: number) {
            this.filesToUpload.splice(index, 1)
        }

        upload() {
            this.$emit('uploadTriggered', this.filesToUpload)
            this.filesToUpload = []
        }
}

</script>
