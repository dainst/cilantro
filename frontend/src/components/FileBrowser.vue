<template>
    <div v-if="files.length !== 0">
        <b-table :data="files" :columns="columns"></b-table>
    </div>
    <div v-else>
        No files found!
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '@/store'
import stagingStore from '@/stagingStore'
import axios from 'axios'

@Component
export default class FileBrowser extends Vue {
    files: object[] = []
    columns: object[] = [
        {
            field: 'name',
            label: 'Filename'
        }
    ]

    constructor() {
        super()
        this.fetchFiles()
        this.watchFiles()
    }

    fetchFiles() {
        axios.get(
            store.state.backendURI + 'staging',
            {
                auth: {
                    username: store.state.user,
                    password: store.state.password
                }
            }
        ).then((response) => {
            this.files = response.data
        }).catch((error) => {
            if (error.response === undefined) {
                console.log('Application Error', error)
            } else {
                console.log('Invalid Server Response:', error.response)
            }
            this.$toast.open({
                message: 'No files fetched from Backend',
                type: 'is-danger',
                queue: false
            })
        })
    }

    watchFiles() {
        stagingStore.subscribe((mutation) => {
            if (mutation.type === 'refresh') {
                this.fetchFiles()
                stagingStore.commit('refreshed')
            }
        })
    }
}
</script>
