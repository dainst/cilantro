<template>
    <section>
        <b-field>
            <b-upload v-model="dropFiles"
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
        <div class="tags section">
            <span v-for="(file, index) in dropFiles"
                  :key="index"
                  class="tag is-primary">
                {{file.name}}
                <button class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)">
                </button>
            </span>
        </div>
        <b-button @click="upload" :disabled="running || this.dropFiles.length === 0">
            Upload
        </b-button>
        <p>
            <span v-if="running">Upload is running! {{processedFiles}} of {{dropFiles.length}} uploaded</span>
        </p>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import stagingStore from '@/stagingStore'
import store from '@/store'
import axios from 'axios'

@Component
export default class UploadFiles extends Vue {
    dropFiles: File[] = []
    processedFiles: number = 0
    successfulFiles: number = 0
    running: boolean = false

    deleteDropFile(index: number) {
        this.dropFiles.splice(index, 1)
    }

    upload() {
        this.running = true
        for (let file of this.dropFiles) {
            let formData = new FormData()
            formData.append('file', file)
            axios.post(store.state.backendURI + 'staging',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    auth: {
                        username: store.state.user,
                        password: store.state.password
                    }
                }
            ).then(() => {
                this.successfulFiles++
                this.$snackbar.open({
                    message: 'Upload of ' + file.name + ' successful!',
                    queue: false
                })
                this.changeUploadStatus()
                stagingStore.commit('refresh')
            }).catch((error) => {
                if (error.response === undefined) {
                    console.log('Application Error', error)
                } else {
                    console.log('Invalid Server Response:', error.response)
                }
                this.$snackbar.open({
                    message: 'Upload of ' + file.name + ' failed!',
                    type: 'is-danger',
                    queue: false
                })
                this.changeUploadStatus()
            })
        }
    }

    changeUploadStatus() {
        this.processedFiles++
        if (this.processedFiles === this.dropFiles.length) {
            if (this.successfulFiles === this.processedFiles) {
                this.$toast.open({
                    message: 'Upload of ' + this.successfulFiles + ' files completed!',
                    type: 'is-success',
                    queue: false
                })
            } else {
                this.$toast.open({
                    message: 'Upload of ' + (this.processedFiles - this.successfulFiles) + ' failed!',
                    type: 'is-danger',
                    queue: false
                })
            }
            this.running = false
            this.successfulFiles = 0
            this.processedFiles = 0
            this.dropFiles = []
        }
    }
}

</script>
