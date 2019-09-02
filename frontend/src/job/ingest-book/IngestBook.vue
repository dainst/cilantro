<template>
    <div class="container">
        <b-steps v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation">
            <b-step-item label="Book Files" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Book Metadata" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Parts" :clickable="isStepsClickable"></b-step-item>
            <b-step-item label="Other Settings" :clickable="isStepsClickable"></b-step-item>
        </b-steps>

        <div v-if="activeStep === 0">
            <BookFilesForm v-bind:filesParam.sync="bookFiles" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 1">
            <BookMetadataForm v-bind:objectID.sync="objectID" v-bind:metadata="bookMetadata" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 2">
            <BookPartsForm v-bind:initialData="bookParts" />
            <ContinueButton @click="saveAndContinue"></ContinueButton>
        </div>
        <div v-if="activeStep === 3">
            <StartJobButton @click="startJob"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { startJob } from '../JobClient';
import BookFilesForm from './forms/BookFilesForm.vue';
import BookMetadataForm from './forms/BookMetadataForm.vue';
import BookPartsForm from './forms/BookPartsForm.vue';

import {
    BookImportParameters, BookPartMetadata, Author, BookPart, FileParam, BookMetadata
} from './BookImportParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';

@Component({
    components: {
        BookFilesForm,
        BookMetadataForm,
        BookPartsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestBook extends Vue {
    jobParameters: BookImportParameters = initBookJobParams();

    objectID: string = this.jobParameters.object_id;
    bookFiles = this.jobParameters.files;
    bookMetadata: BookMetadata = this.jobParameters.metadata;
    bookParts: BookPart[] = this.jobParameters.parts;

    activeStep: number = 0;
    isAnimated: boolean = true;
    hasNavigation: boolean = false;
    isStepsClickable: boolean = true;

    saveAndContinue() {
        this.activeStep += 1;
    }

    async startJob() {
        try {
            await startJob('ingest_book', this.jobParameters);
        } catch (e) {
            showError(e);
        }
    }

    @Watch('objectID')
    onobjectIDChanged() {
        this.jobParameters.object_id = this.objectID;
    }
}

function initBookJobParams(): BookImportParameters {
    const bookMetadata = {
        title: 'test-book-title',
        abstract: '',
        description: '',
        type: 'book',
        created: '1836-1879',
        identifiers: ['http://zenon.dainst.org/Record/001327877'],
        author: []
    } as BookMetadata;

    const params = {
        object_id: '',
        metadata: bookMetadata,
        files: [],
        parts: []
    } as BookImportParameters;

    return params;
}
</script>

<style scoped lang="scss">
div.step-item {
    font-style: italic;
    font-size: x-large;
}
</style>
