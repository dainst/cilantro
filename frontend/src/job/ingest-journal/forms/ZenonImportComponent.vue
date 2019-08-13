<template>
    <section>
        <b-field label="zenonId" :type="zenonValidationStatus">
            <b-input v-model="articleMetadata.zenonId"></b-input>
            <b-button :disabled="articleMetadata.zenonId < 1"
                      @click="validateZenonRecord">
                Validate
            </b-button>
        </b-field>

        <b-field label="Zenon Search">
            <b-input v-model="searchTerm"></b-input>
            <b-button :disabled="searchTerm.length < 1" @click="search">Search</b-button>
            <b-field label="Search Scope" :label-position="'on-border'">
                <b-select v-model="searchScope">
                    <option value="AllFields">All Fields</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </b-select>
            </b-field>
        </b-field>

        <div>{{ searchStatus }}</div>

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
                <b-button>Add all Zenon data</b-button>
                <b-button @click="articleMetadata.zenonId = props.row.id">Add Zenon-ID</b-button>
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
import { ArticleMetadata } from '../JobParameters';
import {
    search, getRecord, downloadJSONRecord, ZenonRecord, ZenonResultData
} from '../ZenonImport';

@Component
export default class ZenonImportComponent extends Vue {
    @Prop() articleMetadata!: ArticleMetadata

    searchTerm: string = this.articleMetadata.title || '';
    searchScope: string = 'AllFields';
    searchResultRecords: ZenonRecord[] = [];
    searchStatus: string = 'No Search initiated...'
    zenonValidationStatus: string = 'is-info';

    async search() {
        const searchResult: ZenonResultData = await search(this.searchTerm, this.searchScope);
        if (searchResult.resultCount > 0) {
            this.searchStatus = 'Search Results';
            this.searchResultRecords = searchResult.records;
        } else {
            this.searchStatus = 'No results';
            this.searchResultRecords = [];
        }
    }

    async validateZenonRecord() {
        const searchResult: ZenonResultData = await getRecord(this.articleMetadata.zenonId);
        if (searchResult.resultCount > 0) {
            this.searchStatus = 'Zenon record found';
            this.searchResultRecords = searchResult.records;
            this.zenonValidationStatus = 'is-success';
        } else {
            this.searchStatus = 'Zenon Record not found!';
            this.searchResultRecords = [];
            this.zenonValidationStatus = 'is-danger';
        }
    }
}
</script>
