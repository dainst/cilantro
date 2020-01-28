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
                :disabled="hasInvalidObjects()" />
            <ArchivalMaterialMetadataForm
                :selected-paths="selectedPaths" @update:objectsUpdated="onObjectsUpdated" />
            <ContinueButton
                @click="continueToOptions"
                :disabled="hasInvalidObjects()" />
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob" :disabled="hasInvalidObjects()"></StartJobButton>
            <ArchivalMaterialOptionsForm
                :initialOptions="this.parameters.options"
                @options-updated="this.parameters.options = $event" />
            <StartJobButton @click="startJob" :disabled="hasInvalidObjects()"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';
import ArchivalMaterialMetadataForm from './IngestArchivalMaterialMetadataForm.vue';
import JobFilesForm from '../JobFilesForm.vue';
import ArchivalMaterialOptionsForm from './IngestArchivalMaterialOptionsForm.vue';
import {
    IngestArchivalMaterialParameters, IngestArchivalMaterialObject, IngestArchivalMaterialOptions
} from './IngestArchivalMaterialParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { ObjectError } from '../JobParameters';

@Component({
    components: {
        JobFilesForm,
        ArchivalMaterialMetadataForm,
        ArchivalMaterialOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestArchivalMaterial extends Vue {
    selectedPaths: string[] = [];
    parameters: IngestArchivalMaterialParameters;
    activeStep: number = 0;

    constructor() {
        super();

        const options = {
            do_ocr: false,
            ocr_lang: 'eng'
        } as IngestArchivalMaterialOptions;

        this.parameters = new IngestArchivalMaterialParameters([], options);
    }

    continueToMetadata() {
        this.activeStep = 1;
    }

    onObjectsUpdated(objects: IngestArchivalMaterialObject[]) {
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
                await startJob('ingest_archival_material', this.parameters);
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
