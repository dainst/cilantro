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
                :disabled="this.selectedPaths.length === 0" />

            <JobFilesForm :selected-paths.sync="selectedPaths" />

            <ContinueButton
                @click="continueToMetadata"
                :disabled="this.selectedPaths.length === 0" />
        </div>

        <div v-if="activeStep === 1">
            <ContinueButton
                @click="continueToOptions"
                :disabled="hasInvalidTargets" />
            <div class="container">
                <div class="is-size-4">Default copyright statement:</div>
                <b-field>
                    <b-input placeholder="No copyright statement"
                             v-model="defaultCopyright"
                             expanded>
                    </b-input>
                    <p class="control">
                        <b-button
                            class="button is-default"
                            :disabled="defaultCopyright === initialCopyright"
                            @click="defaultCopyright = initialCopyright"
                            icon-left="undo-variant">
                            Initial value
                        </b-button>
                        <b-button
                            class="button is-primary"
                            :disabled="onlyDefaultCopyrightStatementsUsed"
                            @click="setDefaultCopyrightStatement()"
                            icon-right="playlist-check">
                            Apply to all
                        </b-button>
                    </p>
                </b-field>
            </div>
            <br/>
            <ArchivalMaterialMetadataForm
                :selected-paths="selectedPaths" :default-copyright="defaultCopyright"
                @update:targetsUpdated="onTargetsUpdated" />
            <br/>
            <ContinueButton
                @click="continueToOptions"
                :disabled="hasInvalidTargets" />
        </div>

        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets"></StartJobButton>
            <OCROptionsForm
                :initialOptions="this.parameters.options.ocr_options"
                @options-updated="this.parameters.options.ocr_options = $event"
            />
            <br/>
            <AppOptionsForm
                :initialOptions="this.parameters.options.app_options"
                @options-updated="this.parameters.options.app_options = $event"
            />
            <StartJobButton @click="startJob" :disabled="hasInvalidTargets"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JobFilesForm from '@/job/JobFilesForm.vue';
import OCROptionsForm from '@/job/OCROptionsForm.vue';
import AppOptionsForm from '@/job/AppOptionsForm.vue';
import ArchivalMaterialMetadataForm from './IngestArchivalMaterialMetadataForm.vue';

import { startJob } from '../JobClient';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

import { JobTargetError, OCROptions, AppOptions } from '../JobParameters';
import {
    IngestArchivalMaterialParameters, MaybeJobTarget, IngestArchivalOptions, JobTargetData
} from './IngestArchivalMaterialParameters';

@Component({
    components: {
        JobFilesForm,
        ArchivalMaterialMetadataForm,
        OCROptionsForm,
        AppOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestArchivalMaterial extends Vue {
    selectedPaths: string[] = [];
    parameters: IngestArchivalMaterialParameters;
    activeStep: number = 0;
    initialCopyright: string;
    defaultCopyright: string;

    constructor() {
        super();

        const options = {
            ocr_options: {
                do_ocr: false,
                ocr_lang: 'deu'
            } as OCROptions,
            app_options: {
                mark_done: true
            } as AppOptions
        } as IngestArchivalOptions;

        this.parameters = new IngestArchivalMaterialParameters([], options);
        this.initialCopyright = 'Copyright © Deutsches Archäologisches Institut';
        this.defaultCopyright = this.initialCopyright;
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

    setDefaultCopyrightStatement() {
        this.parameters.targets.map((target) => {
            if (target instanceof JobTargetData) {
                const updated = new JobTargetData(target.id, target.path, target.metadata);
                updated.metadata.copyright = this.defaultCopyright;
                return updated;
            }
            return target;
        });
    }

    get hasInvalidTargets() {
        return this.parameters.targets.filter(
            target => target instanceof JobTargetError
        ).length > 0 || this.parameters.targets.length === 0;
    }

    get onlyDefaultCopyrightStatementsUsed() {
        return !this.parameters.targets.some(
            target => (target instanceof JobTargetData &&
                    target.metadata.copyright !== this.defaultCopyright)
        );
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
