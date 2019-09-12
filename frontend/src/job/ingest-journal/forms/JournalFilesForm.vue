<template>
    <div>
        <div class="is-size-4">Select the folders representing journal issues:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <StagingBrowser :selected-paths="selectedPaths" v-on:paths-selected="onPathsSelected" />
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import StagingBrowser from '@/staging/StagingBrowser.vue';
import { JournalIssue } from '../JournalImportParameters';

@Component({
    components: {
        StagingBrowser
    }
})
export default class JournalFilesForm extends Vue {
    @Prop() private issues!: JournalIssue[];

    get selectedPaths(): string[] {
        return this.issues.map(issue => issue.path);
    }

    onPathsSelected(files: string[]) {
        this.$emit('update:issues', files.map(path => initIssue(path)));
    }
}

function initIssue(path: string) {
    return {
        path,
        metadata: {
            zenon_id: 0,
            volume: '',
            year: 0,
            number: '',
            description: '',
            identification: ''
        }
    };
}
</script>
