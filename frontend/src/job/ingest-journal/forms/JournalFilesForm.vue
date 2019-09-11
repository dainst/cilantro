<template>
    <div>
        <div class="is-size-4">Staged files:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <StagingFileBrowser
                :selected-files="selectedFiles"
                v-on:files-selected="onFilesSelected"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import StagingFileBrowser from '@/staging/StagingFileBrowser.vue';
import { JournalIssue } from '../JournalImportParameters';

@Component({
    components: {
        StagingFileBrowser
    }
})
export default class JournalFilesForm extends Vue {
    @Prop() private issues!: JournalIssue[];

    get selectedFiles() {
        return this.issues.map(issue => issue.path);
    }

    onFilesSelected(files: string[]) {
        this.$emit('update:issues', files.map(file => initIssue(file)));
    }
}

function initIssue(path: string) {
    return {
        path,
        metadata: {
            volume: '',
            year: 0,
            number: '',
            description: '',
            identification: ''
        }
    };
}
</script>
