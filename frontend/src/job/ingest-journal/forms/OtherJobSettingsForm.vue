<template>
    <section>
        <b-field grouped group-multiline>
            <b-field label="nlp_language">
                <b-input v-model="metadata.nlp_language"></b-input>
            </b-field>
            <b-field label="do_ocr">
                <b-switch v-model="metadata.do_ocr"></b-switch>
            </b-field>
            <b-field label="keep_ratio">
                <b-switch v-model="metadata.keep_ratio"></b-switch>
            </b-field>
        </b-field>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ArticleMetadata } from '../JobParameters';

@Component
export default class ArticleMetadataForm extends Vue {
    @Prop() private metadata!: ArticleMetadata
}
</script>
