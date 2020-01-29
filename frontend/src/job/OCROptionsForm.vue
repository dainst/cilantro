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
import { OCROptions } from './JobParameters';

@Component
export default class OCROptionsForm extends Vue {
    @Prop({ required: true }) initialOptions!: OCROptions

    options: OCROptions = JSON.parse(JSON.stringify(this.initialOptions));

    @Watch('options')
    onOptionsChanged(options: OCROptions) {
        this.$emit('options-updated', options);
    }
}
</script>
