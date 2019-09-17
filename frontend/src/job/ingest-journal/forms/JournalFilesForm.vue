<template>
    <section>
        <div class="is-size-4">Select the folders representing journal issues:</div>
        <div style="padding-top:10px; padding-bottom:10px">
            <StagingBrowser
                :selected-paths="selectedPaths"
                v-on:update:selected-paths="$emit('update:selected-paths', $event)"
            />
        </div>
    </section>
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
    @Prop({ default: () => [] }) private selectedPaths!: string[];
}
</script>
