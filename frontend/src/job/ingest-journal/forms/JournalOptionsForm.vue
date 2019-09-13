<template>
    <section class="tile is-ancestor">
        <div class="tile is-parent">
            <div class="tile is-child box">
                <p class="title">OJS Options</p>
                <b-field grouped>
                    <b-field label="Journal Code" label-position="on-border" expanded>
                        <b-input v-model="options.ojs_metadata.ojs_journal_code"></b-input>
                    </b-field>
                    <b-field label="User" label-position="on-border" expanded>
                        <b-input v-model="options.ojs_metadata.ojs_user"></b-input>
                    </b-field>
                </b-field>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.auto_publish_issue"
                    >Automatically publish issue</b-switch>
                </b-field>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.default_create_frontpage"
                    >Always create frontpage</b-switch>
                </b-field>
                <b-field>
                    <b-switch
                        v-model="options.ojs_metadata.allow_upload_without_file"
                    >Allow upload without file</b-switch>
                </b-field>
            </div>
        </div>

        <div class="tile is-parent">
            <div class="tile is-child box">
                <h1 class="title">Other Options</h1>
                <b-field grouped>
                    <b-field label="Language" label-position="on-border" expanded>
                        <b-select v-model="options.nlp_params.lang" expanded>
                            <option
                                v-for="(language, key) in languages"
                                :value="key"
                                :key="key"
                            >{{ language }}</option>
                        </b-select>
                    </b-field>
                </b-field>
                <b-field>
                    <b-switch v-model="options.do_ocr">Do OCR</b-switch>
                </b-field>
                <b-field>
                    <b-switch v-model="options.keep_ratio">Keep Image Ratio</b-switch>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { JournalImportOptions, initOptions } from '../JournalImportParameters';

@Component
export default class JournalOptionsForm extends Vue {
    options = initOptions();

    languages = {
        en: 'English',
        de: 'German',
        it: 'Italian',
        es: 'Spanish',
        fr: 'French'
    };

    @Watch('options', { deep: true })
    onOptionsChanged(options: JournalImportOptions) {
        this.$emit('options-updated', options);
    }
}

</script>
