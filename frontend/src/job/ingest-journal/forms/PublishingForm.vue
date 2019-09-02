<template>
    <section>
        <b-collapse :open="false" aria-id="publishing">
            <button
                slot="trigger"
                aria-controls="contentIdForA11y1"
            >Automatisches Veröffentlichen nach dem Import</button>
            <div class="columns">
                <div class="column">
                    <b-field label="ojs_journal_code">
                        <b-input v-model="publishingData.ojs_journal_code" required></b-input>
                    </b-field>
                    <b-field label="ojs_user">
                        <b-input v-model="publishingData.ojs_user" required></b-input>
                    </b-field>
                    <b-field label="auto_publish_issue">
                        <b-switch v-model="publishingData.auto_publish_issue" required></b-switch>
                    </b-field>
                </div>
                <div class="column">
                    <b-field label="default_publish_articles">
                        <b-switch v-model="publishingData.default_publish_articles" required></b-switch>
                    </b-field>
                    <b-field label="default_create_frontpage">
                        <b-switch v-model="publishingData.default_create_frontpage" required></b-switch>
                    </b-field>
                    <b-field label="allow_upload_without_file">
                        <b-switch v-model="publishingData.allow_upload_without_file" required></b-switch>
                    </b-field>
                </div>
            </div>
        </b-collapse>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { OJSMetadata } from '../JournalImportParameters';

@Component
export default class PublishingForm extends Vue {
    @Prop() private publishingData!: OJSMetadata
}
</script>
