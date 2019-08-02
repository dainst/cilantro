<template>
    <section>
        <div class="columns">
            <div class="column">
                <b-field label="volume" :label-position="labelPosition">
                    <b-input v-model="metadata.volume"></b-input>
                </b-field>
                <b-field label="year" :label-position="labelPosition">
                    <b-input v-model="metadata.year"></b-input>
                </b-field>
                <b-field label="number" :label-position="labelPosition">
                    <b-input v-model="metadata.number" type="number"></b-input>
                </b-field>
            </div>
            <div class="column">
                <b-field label="description" :label-position="labelPosition">
                    <b-input v-model="metadata.description"></b-input>
                </b-field>
                <b-field label="identification" :label-position="labelPosition">
                    <b-input v-model="metadata.identification"></b-input>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { JournalMetadata } from '../JobParameters';

@Component
export default class JournalMetadataForm extends Vue {
    @Prop() private metadata!: JournalMetadata

    labelPosition: String = 'on-border';
}
</script>
