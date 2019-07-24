<template>
    <div v-if="filesToShow.length !== 0">
        <b-table :data="filesToShow" :columns="columns"></b-table>
    </div>
    <div v-else>
        No files found!
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class FileBrowser extends Vue {
        @Prop() filesToShow!: object[]
        columns: object[] = [
            {
                field: 'name',
                label: 'Filename'
            }
        ]
}
</script>
