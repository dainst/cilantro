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
                @click="continueToOptions" :disabled="hasInvalidObjects()">
            </ContinueButton>
            <JournalMetadataForm
                :selected-paths="selectedPaths"
                @update:objectsUpdated="onObjectsUpdated"
            />
            <ContinueButton
                @click="continueToOptions" :disabled="hasInvalidObjects()">
            </ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob" :disabled="hasInvalidObjects()"></StartJobButton>
            <JournalOptionsForm
                :initialOptions="this.parameters.options"
                @options-updated="this.parameters.options = $event"
            />
            <StartJobButton @click="startJob" :disabled="hasInvalidObjects()"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import JournalMetadataForm from './IngestJournalMetadataForm.vue';
import JobFilesForm from '../JobFilesForm.vue';
// import ArticlesForm from './forms/ArticlesForm.vue';
import JournalOptionsForm from './IngestJournalOptionsForm.vue';
import {
    IngestJournalParameters, IngestJournalObject, IngestJournalOptions, OJSMetadata
} from './IngestJournalParameters';
import { showError, showSuccess } from '@/util/Notifier';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { JobParameters, ObjectError } from '../JobParameters';

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
    parameters: IngestJournalParameters;
    activeStep: number = 0;

    constructor() {
        super();
        const options = {
            ojs_metadata: {
                auto_publish_issue: false,
                default_create_frontpage: true,
                allow_upload_without_file: false
            } as OJSMetadata,
            do_ocr: false,
            ocr_lang: 'eng'
        } as IngestJournalOptions;

        this.parameters = new IngestJournalParameters([], options);
    }

    continueToMetadata() {
        this.activeStep = 1;
    }

    onObjectsUpdated(objects: IngestJournalObject[]) {
        this.parameters.objects = objects;
    }

    continueToOptions() {
        this.activeStep = 2;
    }

    hasInvalidObjects() {
        return this.parameters.objects.filter(object => object instanceof ObjectError).length > 0;
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
