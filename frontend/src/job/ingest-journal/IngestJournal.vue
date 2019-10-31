<template>
    <div class="container">
        <b-steps v-model="activeStep" :has-navigation="(false)">
            <b-step-item label="Journal Files"></b-step-item>
            <b-step-item label="Journal Metadata"></b-step-item>
            <b-step-item label="Start Import"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <ContinueButton @click="continueToMetadata" :disabled="this.selectedPaths.length == 0"></ContinueButton>
            <JournalFilesForm :selected-paths.sync="selectedPaths" />
            <ContinueButton @click="continueToMetadata" :disabled="this.selectedPaths.length == 0"></ContinueButton>
        </div>
        <div v-if="activeStep === 1">
            <ContinueButton @click="continueToOptions" :disabled="this.issues.length == 0"></ContinueButton>
            <JournalMetadataForm :selected-paths="selectedPaths" @update:issues="onIssuesUpdated" />
            <ContinueButton @click="continueToOptions" :disabled="this.issues.length == 0"></ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob"></StartJobButton>
            <JournalOptionsForm :initialOptions="options" @options-updated="options = $event" />
            <StartJobButton @click="startJob"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import JournalMetadataForm from './forms/JournalMetadataForm.vue';
import JobFilesForm from '../JobFilesForm.vue';
import ArticlesForm from './forms/ArticlesForm.vue';
import JournalOptionsForm from './forms/JournalOptionsForm.vue';
import {
    JournalImportParameters, JournalIssue, JournalImportOptions, initOptions
} from './JournalImportParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { JobParameters } from '../JobParameters';

@Component({
    components: {
        JobFilesForm,
        JournalMetadataForm,
        JournalOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestJournal extends Vue {
    selectedPaths: string[] = [];
    issues: JournalIssue[] = [];
    options: JournalImportOptions = initOptions();
    activeStep: number = 0;

    continueToMetadata() {
        this.activeStep = 1;
    }

    onIssuesUpdated(issues: JournalIssue[]) {
        this.issues = issues.filter(issue => issue.metadata.zenon_id > 0);
    }

    continueToOptions() {
        this.activeStep = 2;
    }

    async startJob() {
        const params = this.buildJobParams();
        try {
            await startJob('ingest_journals', params);
            showSuccess('Job started');
            this.$router.push({ path: '/' });
        } catch (e) {
            showError(e);
        }
    }

    buildJobParams(): JournalImportParameters {
        return {
            objects: this.issues,
            options: this.options
        };
    }
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>
