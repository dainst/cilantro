<template>
    <div v-if="filesToShow.length !== 0">
        <b-table :data="filesToShow" :columns="columns" focusable :selected.sync="selected">
        </b-table>
    </div>
    <div v-else>
        No files found!
    </div>
</template>

<script lang="ts">
import {
    Component, Prop, Vue, Watch
} from 'vue-property-decorator';

@Component
export default class FileBrowser extends Vue {
    @Prop() filesToShow!: object[]
    @Prop() initialSelected!: object

    columns: object[] = [
        {
            field: 'name',
            label: 'Filename'
        }
    ]

    selected = this.initialSelected || {};

    @Watch('selected')
    onSelectedChanged(value: string, oldValue: string) {
        this.$emit('update:initialSelected', this.selected);
    }

    @Watch('initialSelected')
    oninitialSelectedChanged(value: string, oldValue: string) {
        this.selected = this.initialSelected;
    }
}
</script>
