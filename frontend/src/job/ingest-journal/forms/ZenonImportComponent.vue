<template>
    <section>
        <b-field label="Zenon Search">
            <b-input v-model="searchTerm"></b-input>
            <b-button :disabled="searchTerm.length < 1" @click="search">Search</b-button>
        </b-field>

        <b-table v-if="searchResultRecords.length > 0" :data="searchResultRecords">
            <template slot-scope="props">
                <b-table-column label="ID" numeric>
                    {{ props.row.id }}
                </b-table-column>
                <b-table-column label="Title">
                    {{ props.row.title }}
                </b-table-column>
                <b-table-column label="Authors">
                    {{ Object.keys(props.row.authors.primary).join(', ') }}
                </b-table-column>
                <b-table-column label="Languages">
                    {{ props.row.languages.join(', ') }}
                </b-table-column>
                <b-table-column label="Subjects">
                    {{ props.row.subjects.join(', ') }}
                </b-table-column>
                <b-button @click="$emit('addZenonID', props.row.id)">Add Zenon-ID</b-button>
                <b-button>Add all Zenon data</b-button>
                <a class="button" v-bind:href="`https://zenon.dainst.org/Record/${props.row.id}`" target="_blank">
                    View in Zenon
                </a>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
// TODO add-all-Zenon-data button

import { Component, Vue, Prop } from 'vue-property-decorator';
import search, { ZenonRecord, ZenonResultData } from '../ZenonImport';

@Component
export default class ZenonImportComponent extends Vue {
    @Prop() articleTitle!: string

    searchTerm: string = this.articleTitle || '';
    searchResultRecords: ZenonRecord[] = [];

    async search() {
        const searchResult: ZenonResultData = await search(this.searchTerm);
        if (searchResult.resultCount > 0) {
            this.searchResultRecords = searchResult.records;
        } else {
            this.searchResultRecords = [];
        }
    }
}
</script>
