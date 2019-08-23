<template>
    <div class="container">
        <b-steps v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation">
            <b-step-item label="Journal Files" :clickable="isStepsClickable">
            </b-step-item>
            <b-step-item label="Journal Metadata" :clickable="isStepsClickable">
            </b-step-item>
            <b-step-item label="Article Files and Metadata" :clickable="isStepsClickable">
            </b-step-item>
            <b-step-item label="Publishing" :clickable="isStepsClickable">
            </b-step-item>
            <b-step-item label="Other Settings" :clickable="isStepsClickable">
            </b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <b-button @click="saveAndContinue">Continue</b-button>
            <JournalFilesForm v-bind:filesParam.sync="journalFiles" />
        </div>
        <div v-if="activeStep === 1">
            <b-button @click="saveAndContinue">Continue</b-button>
            <JournalMetadataForm v-bind:metadata="journalMetadata" />
        </div>
        <div v-if="activeStep === 2">
            <b-button @click="saveAndContinue">Continue</b-button>
            <ArticlesForm
                v-bind:initialData="articleFilesAndRanges"
                v-bind:availableFiles="journalFiles"/>
        </div>
        <div v-if="activeStep === 3">
            <b-button @click="saveAndContinue">Continue</b-button>
            <PublishingForm v-bind:publishingData="publishingData" />
        </div>
        <div v-if="activeStep === 4">
            <b-button @click="startJob">Start Job</b-button>
            <OtherJobSettingsForm v-bind:metadata="otherSettings" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '@/util/WorkbenchClient';
import { RequestResult } from '@/util/HTTPClient';

import JournalMetadataForm from './forms/JournalMetadataForm.vue';
import JournalFilesForm from './forms/JournalFilesForm.vue';
import ArticlesForm from './forms/ArticlesForm.vue';
import PublishingForm from './forms/PublishingForm.vue';
import OtherJobSettingsForm from './forms/OtherJobSettingsForm.vue';
import {
    JournalImportParameters, FileRange, JournalMetadata, OJSMetadata, Part, NLPParams
} from './JournalImportParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';

@Component({
    components: {
        JournalFilesForm,
        JournalMetadataForm,
        ArticlesForm,
        PublishingForm,
        OtherJobSettingsForm
    }
})
export default class IngestJournal extends Vue {
    backendUri = this.$store.state.AuthenticationStore.backendUri;

    jobParameters: JournalImportParameters = initJobParams();
    journalFiles = this.jobParameters.files;
    journalMetadata: JournalMetadata = this.jobParameters.metadata;
    articleFilesAndRanges: Part[] = this.jobParameters.parts;
    publishingData: OJSMetadata = this.jobParameters.ojs_metadata;
    otherSettings: Object = {
        nlp_language: this.jobParameters.nlp_params.lang,
        do_ocr: this.jobParameters.do_ocr,
        keep_ratio: this.jobParameters.keep_ratio
    }

    activeStep: number = 0;
    isAnimated: boolean = true;
    hasNavigation: boolean = false;
    isStepsClickable: boolean = true;

    saveAndContinue() {
        this.activeStep += 1;
    }

    async startJob() {
        const response = await startJob('ingest_journal', this.jobParameters);
        if (response.status === 'success') {
            showSuccess('Job started successfully', this);
        } else {
            showError(response.payload, this);
        }
    }
}

function initJobParams(): JournalImportParameters {
    const journalMetadata = {
        volume: '',
        year: 2018,
        number: '',
        description: '[PDFs teilweise verf\u00fcgbar]',
        identification: 'year'
    } as JournalMetadata;

    const ojsMetadata = {
        ojs_journal_code: 'test',
        ojs_user: 'ojs_user',
        auto_publish_issue: true,
        default_publish_articles: true,
        default_create_frontpage: true,
        allow_upload_without_file: false
    } as OJSMetadata;

    const nlpParams = {
        lang: 'de'
    } as NLPParams;

    const params = {
        metadata: journalMetadata,
        files: [],
        parts: [],
        ojs_metadata: ojsMetadata,
        do_ocr: false,
        keep_ratio: true,
        nlp_params: nlpParams
    } as JournalImportParameters;

    return params;
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>
