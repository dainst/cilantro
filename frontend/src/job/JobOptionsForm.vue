<template>
    <div>
        <p class="title">OCR Options</p>
        <b-field>
            <b-switch v-model="options.do_ocr">
                Do OCR on image files
            </b-switch>
        </b-field>
        <b-field label="OCR language">
            <b-select v-model="options.ocr_lang">
                <option value="eng">eng</option>
                <option value="deu">deu</option>
            </b-select>
        </b-field>
    </div>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { JournalImportOptions } from './ingest-journal/JournalImportParameters';
import { BookImportOptions } from './ingest-book/BookImportParameters';

@Component
export default class JobOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: BookImportOptions | JournalImportOptions;

    options: BookImportOptions | JournalImportOptions =
        JSON.parse(JSON.stringify(this.initialOptions));

    @Watch('options')
    onOptionsChanged(options: BookImportOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
