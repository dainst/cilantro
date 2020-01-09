<template>
  <div class="container">
    <b-steps v-model="activeStep" :has-navigation="(false)">
      <b-step-item label="Text Files"></b-step-item>
      <b-step-item label="Start NLP"></b-step-item>
    </b-steps>

    <div v-if="activeStep === 0">
      <ContinueButton @click="continueToJobStart" :disabled="this.selectedPaths.length == 0"></ContinueButton>
      <JobFilesForm :selected-paths.sync="selectedPaths" />
      <ContinueButton @click="continueToJobStart" :disabled="this.selectedPaths.length == 0"></ContinueButton>
    </div>
    <div v-if="activeStep === 1">
      <StartJobButton @click="startJob"></StartJobButton>
      <NlpTaskOptionsForm :initialOptions="options" @options-updated="options = $event" />
      <StartJobButton @click="startJob"></StartJobButton>
    </div>
  </div>
</template>


<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import { startJob } from '../JobClient';
import JobFilesForm from '../JobFilesForm.vue';
import { JobParameters } from '../JobParameters';

import {
    NlpTaskParameters, NlpTaskOptions, initOptions, initNlpTaskTargetTextfile
} from './NlpTaskParameters';

import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

import NlpTaskOptionsForm from './forms/NlpTaskOptionsForm.vue';

@Component({
    components: {
        JobFilesForm,
        ContinueButton,
        StartJobButton,
        NlpTaskOptionsForm
    }
})
export default class NlpTask extends Vue {
    selectedPaths: string[] = [];
    activeStep: number = 0;
    options: NlpTaskOptions = initOptions();

    continueToJobStart() {
        this.activeStep = 1
    }

    async startJob() {
        const params = this.buildJobParams();
        try {
            await startJob('nlp_task', params);
            showSuccess('Job started');
            this.$router.push({ path: '/' });
        } catch (e) {
            showError(e);
        }
    }

    buildJobParams(): NlpTaskParameters {
        return {
            objects: this.selectedPaths.map(
              path => initNlpTaskTargetTextfile(path)
            ),
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
