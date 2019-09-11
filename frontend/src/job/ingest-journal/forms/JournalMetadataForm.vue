<template>
    <section>
        <div class="columns" v-for="issue in issues" :key="issue.path">
            <h1>{{issue.path}}</h1>
            <div class="column">
                <b-field label="volume" :label-position="labelPosition">
                    <b-input v-model="issue.metadata.volume"></b-input>
                </b-field>
                <b-field label="year" :label-position="labelPosition">
                    <b-input v-model="issue.metadata.year"></b-input>
                </b-field>
                <b-field label="number" :label-position="labelPosition">
                    <b-input v-model="issue.metadata.number" type="number"></b-input>
                </b-field>
            </div>
            <div class="column">
                <b-field label="description" :label-position="labelPosition">
                    <b-input v-model="issue.metadata.description"></b-input>
                </b-field>
                <b-field label="identification" :label-position="labelPosition">
                    <b-input v-model="issue.metadata.identification"></b-input>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { JournalIssueMetadata, JournalIssue } from '../JournalImportParameters';

@Component
export default class JournalMetadataForm extends Vue {
    @Prop() private issues!: JournalIssue[];

    labelPosition: string = 'on-border';
}
</script>
