<template>
    <div class="container">
        <b-steps v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation">
            <b-step-item label="Journal Files" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Journal Metadata" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Publishing" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Other Settings" :clickable="isStepsClickable"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <JournalFilesForm v-bind:filesParam.sync="jobParameters.objects" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 1">
            <JournalMetadataForm v-bind:metadata="jobParameters.objects" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <PublishingForm v-bind:publishingData="jobParameters.options" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 3">
            <OtherJobSettingsForm v-bind:metadata="jobParameters.options" />
            <StartJobButton @click="startJob"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import JournalMetadataForm from './forms/JournalMetadataForm.vue';
import JournalFilesForm from './forms/JournalFilesForm.vue';
import ArticlesForm from './forms/ArticlesForm.vue';
import PublishingForm from './forms/PublishingForm.vue';
import OtherJobSettingsForm from './forms/OtherJobSettingsForm.vue';
import {
    JournalImportParameters, JournalIssue
} from './JournalImportParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { JobParameters } from '../JobParameters';

@Component({
    components: {
        JournalFilesForm,
        JournalMetadataForm,
        PublishingForm,
        OtherJobSettingsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestJournal extends Vue {
    jobParameters: JournalImportParameters = initJobParams();

    activeStep: number = 0;
    isAnimated: boolean = true;
    hasNavigation: boolean = false;
    isStepsClickable: boolean = true;

    saveAndContinue() {
        this.activeStep += 1;
    }

    async startJob() {
        try {
            await startJob('ingest_journal', this.jobParameters);
        } catch (e) {
            showError(e);
        }
    }
}

function initJobParams(): JournalImportParameters {
    return {
        objects: [],
        options: {
            ojs_metadata: {
                ojs_journal_code: 'test',
                ojs_user: 'ojs_user',
                auto_publish_issue: true,
                default_create_frontpage: true,
                allow_upload_without_file: false
            },
            do_ocr: false,
            keep_ratio: true,
            nlp_params: {
                lang: 'de'
            }
        }
    };
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>
