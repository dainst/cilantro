<template>
    <div class="container">
        <b-steps v-model="activeStep" :has-navigation="(false)">
            <b-step-item label="Journal Files"></b-step-item>
            <b-step-item label="Journal Metadata"></b-step-item>
            <b-step-item label="Start Import"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <ContinueButton
                @click="continueToMetadata" :disabled="this.selectedPaths.length == 0">
            </ContinueButton>
            <JobFilesForm :selected-paths.sync="selectedPaths" />
            <ContinueButton
                @click="continueToMetadata" :disabled="this.selectedPaths.length == 0">
            </ContinueButton>
        </div>
        <div v-if="activeStep === 1">
            <ContinueButton
                @click="continueToOptions" :disabled="hasInvalidTargets()">
            </ContinueButton>
            <JournalMetadataForm
                :selected-paths="selectedPaths"
                @update:targetsUpdated="onTargetsUpdated"
            />
            <ContinueButton
                @click="continueToOptions" :disabled="hasInvalidTargets()">
            </ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets()"></StartJobButton>
            <JournalOptionsForm
                :initialOptions="this.parameters.options"
                @options-updated="this.parameters.options = $event"
            />
            <AppOptionsForm 
                :initialOptions="this.parameters.options.app_options"  
                @options-updated="this.parameters.options.app_options = $event" 
                />
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets()"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import JobFilesForm from '../JobFilesForm.vue';
import JournalMetadataForm from './IngestJournalMetadataForm.vue';
import JournalOptionsForm from './IngestJournalOptionsForm.vue';
import AppOptionsForm from '../AppOptionsForm.vue';

import { JobParameters, JobTargetError, OCROptions, AppOptions } from '../JobParameters';
import {
    IngestJournalParameters, MaybeJobTarget, IngestJournalOptions, OJSOptions
} from './IngestJournalParameters';

import { showError, showSuccess } from '@/util/Notifier';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

@Component({
    components: {
        JobFilesForm,
        JournalMetadataForm,
        JournalOptionsForm,
        AppOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestJournal extends Vue {
    selectedPaths: string[] = [];
    parameters: IngestJournalParameters;
    activeStep: number = 0;

    constructor() {
        super();

        const options = {
            ojs_options: {
                default_create_frontpage: true
            } as OJSOptions,
            ocr_options: {
                do_ocr: false,
                ocr_lang: 'deu'
            } as OCROptions,
            app_options: {
                keep_staging: false
            } as AppOptions
        } as IngestJournalOptions;

        this.parameters = new IngestJournalParameters([], options);
    }

    continueToMetadata() {
        this.activeStep = 1;
    }

    onTargetsUpdated(targets: MaybeJobTarget[]) {
        this.parameters.targets = targets;
    }

    continueToOptions() {
        this.activeStep = 2;
    }

    hasInvalidTargets() {
        return this.parameters.targets.filter(
            target => target instanceof JobTargetError
        ).length > 0 || this.parameters.targets.length === 0;
    }

    async startJob() {
        try {
            if (this.parameters !== undefined) {
                await startJob('ingest_journals', this.parameters);
                showSuccess('Job started');
                this.$router.push({ path: '/' });
            }
        } catch (e) {
            showError(e);
        }
    }
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>
