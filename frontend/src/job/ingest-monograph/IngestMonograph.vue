<template>
    <div class="container">
        <b-steps v-model="activeStep" :has-navigation="false">
            <b-step-item label="Book Files"></b-step-item>
            <b-step-item label="Book Metadata"></b-step-item>
            <b-step-item label="Start Import"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <ContinueButton
                @click="continueToMetadata" :disabled="this.selectedPaths.length === 0">
            </ContinueButton>
            <JobFilesForm
                :selected-paths.sync="selectedPaths"
                :accepted-filetypes="acceptedFileTypes"/>
            <ContinueButton
                @click="continueToMetadata" :disabled="this.selectedPaths.length === 0">
            </ContinueButton>
        </div>
        <div v-if="activeStep === 1">
            <ContinueButton
                @click="continueToOptions" :disabled="hasInvalidTargets()">
            </ContinueButton>
            <MonographMetadataForm
                :selected-paths="selectedPaths"
                @update:targetsUpdated="onTargetsUpdated"
            />
            <ContinueButton
                @click="continueToOptions" :disabled="hasInvalidTargets()">
            </ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets()"></StartJobButton>
            <OCROptionsForm
                :initialOptions="this.parameters.options.ocr_options"
                @options-updated="this.parameters.options.ocr_options = $event"
            />
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets()"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import JobFilesForm from '../JobFilesForm.vue';
import MonographMetadataForm from './IngestMonographMetadataForm.vue';

import { JobTargetError, OCROptions } from '../JobParameters';
import {
    IngestMonographParameters, MaybeJobTarget, IngestMonographOptions
} from './IngestMonographParameters';

import { showError, showSuccess } from '@/util/Notifier';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import OCROptionsForm from '@/job/OCROptionsForm.vue';

@Component({
    components: {
        JobFilesForm,
        MonographMetadataForm,
        OCROptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestBook extends Vue {
    selectedPaths: string[] = [];
    parameters: IngestMonographParameters;
    activeStep: number = 0;
    acceptedFileTypes = 'image/tiff, image/tif';

    constructor() {
        super();

        const options = {
            ocr_options: {
                do_ocr: true,
                ocr_lang: 'deu'
            } as OCROptions
        } as IngestMonographOptions;

        this.parameters = new IngestMonographParameters([], options);
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
                await startJob('ingest_monographs', this.parameters);
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
