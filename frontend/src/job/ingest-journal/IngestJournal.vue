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

        <div>
            <b-button @click="saveAndContinue">Continue</b-button>
        </div>
        <br>
        <div v-if="activeStep === 0">
            <JournalFilesForm v-bind:filesParam.sync="journalFiles" />
        </div>

        <div v-if="activeStep === 1">
            <JournalMetadataForm v-bind:metadata="journalMetadata" />
        </div>

        <div v-if="activeStep === 2">
            <FilesAndRangesForm
                v-bind:initialData="articleFilesAndRanges"
                v-bind:availableFiles="journalFiles"/>
        </div>

        <div v-if="activeStep === 3">
            <b-button @click="startJob">Start Job</b-button>
            <PublishingForm v-bind:publishingData="publishingData" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

import JournalMetadataForm from './forms/JournalMetadataForm.vue';
import JournalFilesForm from './forms/JournalFilesForm.vue';
import FilesAndRangesForm from './forms/FilesAndRangesForm.vue';
import PublishingForm from './forms/PublishingForm.vue';
import OtherJobSettingsForm from './forms/OtherJobSettingsForm.vue';
import {
    JobParameters, FileRange, JournalMetadata, OJSMetadata, Part, NLPParams
} from './JobParameters';

@Component({
    components: {
        JournalFilesForm,
        JournalMetadataForm,
        FilesAndRangesForm,
        PublishingForm,
        OtherJobSettingsForm
    }
})
export default class IngestJournal extends Vue {
    backendUri = process.env.VUE_APP_BACKEND_URI || '/api';

    jobParameters: JobParameters = initJobParams();
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

    startJob() {
        axios.post(
            `${this.backendUri}/job/ingest_journal`,
            this.jobParameters
        )
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

function initJobParams(): JobParameters {
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
    } as JobParameters;

    return params;
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>