<template>
    <div v-if="filesToShow.length !== 0">
        <b-table :data="filesToShow" :columns="columns"></b-table>
    </div>
    <div v-else>
        No files found!
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class FileBrowser extends Vue {
    @Prop() dirToShow!: string

    filesToShow: File[] = [];

    columns: object[] = [
        {
            field: 'name',
            label: 'Filename'
        }
    ]

    mounted() {
        this.fetchFiles();
    }

    fetchFiles() {
        axios.get(
            `${this.$store.state.backendURI}${this.dirToShow}`
        ).then((response) => {
            this.filesToShow = response.data;
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
}
</script>
