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
                <option value="eng">English</option>
                <option value="deu">German</option>
                <option value="ita">Italian</option>
                <option value="fra">French</option>
                <option value="spa">Spanish; Castilian</option>
                <option value="ell">Greek, Modern, 1453+</option>
                <option value="rus">Russian</option>
                <option value="ara">Arabic</option>
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
    @Prop({ required: true }) initialOptions!: OCROptions;

    options: OCROptions = this.initialOptions;

    @Watch('options')
    onOptionsChanged(options: OCROptions) {
        this.$emit('options-updated', options);
    }
}
</script>
