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
import { IngestArchivalMaterialOptions } from './ingest-archival-material/IngestArchivalMaterialParameters';

@Component
export default class JobOptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: IngestArchivalMaterialOptions | JournalImportOptions;

    options: IngestArchivalMaterialOptions | JournalImportOptions =
        JSON.parse(JSON.stringify(this.initialOptions));

    @Watch('options')
    onOptionsChanged(options: IngestArchivalMaterialOptions) {
        this.$emit('options-updated', options);
    }
}
</script>
