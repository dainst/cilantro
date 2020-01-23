<template>
    <div class="container">
        <b-steps v-model="activeStep" :has-navigation="(false)">
            <b-step-item label="Record Files"></b-step-item>
            <b-step-item label="Record Metadata"></b-step-item>
            <b-step-item label="Start Import"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <ContinueButton
                @click="continueToMetadata"
                :disabled="this.selectedPaths.length == 0" />
            <JobFilesForm :selected-paths.sync="selectedPaths" />
            <ContinueButton
                @click="continueToMetadata"
                :disabled="this.selectedPaths.length == 0" />
        </div>
        <div v-if="activeStep === 1">
            <ContinueButton
                @click="continueToOptions"
                :disabled="this.records.length == 0" />
            <RecordMetadataForm
                :selected-paths="selectedPaths" @update:records="onRecordsUpdated" />
            <ContinueButton
                @click="continueToOptions"
                :disabled="this.records.length == 0" />
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob"></StartJobButton>
            <RecordOptionsForm :initialOptions="options" @options-updated="options = $event" />
            <StartJobButton @click="startJob"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';
import RecordMetadataForm from './forms/ArchivalMaterialMetadataForm.vue';
import JobFilesForm from '../JobFilesForm.vue';
import RecordOptionsForm from './forms/ArchivalMaterialOptionsForm.vue';
import {
    IngestArchivalMaterialParameters, IngestArchivalMaterialObject, IngestArchivalMaterialOptions, initOptions
} from './IngestArchivalMaterialParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { JobParameters } from '../JobParameters';

@Component({
    components: {
        JobFilesForm,
        RecordMetadataForm,
        RecordOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestArchivalMaterial extends Vue {
    selectedPaths: string[] = [];
    records: IngestArchivalMaterialObject[] = [];
    options: IngestArchivalMaterialOptions = initOptions();
    activeStep: number = 0;

    continueToMetadata() {
        this.activeStep = 1;
    }

    onRecordsUpdated(records: IngestArchivalMaterialObject[]) {
        this.records = records;
    }

    continueToOptions() {
        this.activeStep = 2;
    }

    async startJob() {
        const params = this.buildJobParams();
        try {
            await startJob('ingest_records', params);
            showSuccess('Job started');
            this.$router.push({ path: '/' });
        } catch (e) {
            showError(e);
        }
    }

    buildJobParams(): IngestArchivalMaterialParameters {
        return {
            objects: this.records,
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
