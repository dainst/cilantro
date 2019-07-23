<template>
    <section>
        <div class=columns>
            <div class=column>
                <b-field label="volume" :label-position="labelPosition">
                    <b-input v-model="volume"></b-input>
                </b-field>
                <b-field label="year" :label-position="labelPosition">
                    <b-input v-model="year"></b-input>
                </b-field>
                <b-field label="number" :label-position="labelPosition">
                    <b-input v-model="number" type="number"></b-input>
                </b-field>
            </div>
            <div class=column>
                <b-field label="description" :label-position="labelPosition">
                    <b-input v-model="description"></b-input>
                </b-field>
                <b-field label="identification" :label-position="labelPosition">
                    <b-input v-model="identification"></b-input>
                </b-field>
            </div>
        </div>

    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class JournalMetadataForm extends Vue {
    data() {
        return {
            labelPosition: 'on-border',

            volume: '',
            year: '',
            number: '',
            description: '',
            identification: ''
        }
    }
}
</script>
