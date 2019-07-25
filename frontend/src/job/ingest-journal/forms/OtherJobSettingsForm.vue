<template>
    <section>
        <b-field grouped group-multiline>
            <b-field label="nlp_language">
                <b-input v-model="settings.nlp_language"></b-input>
            </b-field>
            <b-field label="do_ocr">
                <b-switch v-model="settings.do_ocr"></b-switch>
            </b-field>
            <b-field label="keep_ratio">
                <b-switch v-model="settings.keep_ratio"></b-switch>
            </b-field>
        </b-field>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ArticleMetadataForm extends Vue {
    @Prop() private initialData!: Object

    data() {
        return {
            settings: this.$props.initialData
        };
    }
}
</script>
