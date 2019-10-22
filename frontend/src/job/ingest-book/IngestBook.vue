<template>
    <div class="container">
        <b-steps v-model="activeStep" :has-navigation="(false)">
            <b-step-item label="Book Files"></b-step-item>
            <b-step-item label="Book Metadata"></b-step-item>
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
                :disabled="this.books.length == 0" />
            <BookMetadataForm
                :selected-paths="selectedPaths" @update:books="onBooksUpdated" />
            <ContinueButton
                @click="continueToOptions"
                :disabled="this.books.length == 0" />
        </div>
        <div v-if="activeStep === 2">
            <StartJobButton @click="startJob"></StartJobButton>
            <BookOptionsForm @options-updated="options = $event" />
            <StartJobButton @click="startJob"></StartJobButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { startJob } from '../JobClient';

import BookMetadataForm from './forms/BookMetadataForm.vue';
import JobFilesForm from '../JobFilesForm.vue';
import BookOptionsForm from './forms/BookOptionsForm.vue';
import {
    BookImportParameters, Book, BookImportOptions, initOptions
} from './BookImportParameters';
import { showError, showSuccess } from '@/util/Notifier.ts';
import ContinueButton from '@/util/ContinueButton.vue';
import StartJobButton from '@/util/StartJobButton.vue';
import { JobParameters } from '../JobParameters';

@Component({
    components: {
        JobFilesForm,
        BookMetadataForm,
        BookOptionsForm,
        ContinueButton,
        StartJobButton
    }
})
export default class IngestBook extends Vue {
    selectedPaths: string[] = [];
    books: Book[] = [];
    options: BookImportOptions = initOptions();
    activeStep: number = 0;

    continueToMetadata() {
        this.activeStep = 1;
    }

    onBooksUpdated(books: Book[]) {
        this.books = books;
    }

    continueToOptions() {
        this.activeStep = 2;
    }

    async startJob() {
        const params = this.buildJobParams();
        try {
            await startJob('ingest_book', params);
            showSuccess('Job started');
            this.$router.push({ path: '/' });
        } catch (e) {
            showError(e);
        }
    }

    buildJobParams(): BookImportParameters {
        return {
            objects: this.books,
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
