<template>
    <section>
        <b-field label="Zenon ID" :type="zenonValidationStatus">
            <b-input v-model="articleMetadata.zenonId"></b-input>
            <b-button :disabled="articleMetadata.zenonId < 1"
                      @click="validateZenonRecord">
                Validate
            </b-button>
        </b-field>

        <b-field label="Zenon Search">
            <b-input v-model="searchTerm"></b-input>
            <b-button class="zenonSearchButton" :disabled="searchTerm.length < 1"
                      @click="search">
                Search
            </b-button>
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
                <b-button @click="articleMetadata.zenonId = props.row.id">Add Zenon-ID</b-button>
                <b-button @click="addZenonData(props.row.id)">Add all Zenon data</b-button>
                <a class="button" v-bind:href="`https://zenon.dainst.org/Record/${props.row.id}`" target="_blank">
                    View in Zenon
                </a>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ArticleMetadata } from '../JournalImportParameters';
import {
    search, getRecord, ZenonRecord, ZenonResultData, downloadCSLJSONRecord, cslJSONRecord
} from '@/util/ZenonClient';
import { RequestResult } from '@/util/HTTPClient';
import { showError, showSuccess, showWarning } from '@/util/Notifier.ts';

@Component
export default class ZenonImportComponent extends Vue {
    @Prop() articleMetadata!: ArticleMetadata

    searchTerm: string = this.articleMetadata.title || '';
    searchScope: string = 'AllFields';
    searchResultRecords: ZenonRecord[] = [];
    searchStatus: string = 'No Search initiated...'
    zenonValidationStatus: string = 'is-info';

    async search() {
        const response: RequestResult = await search(this.searchTerm, this.searchScope);
        if (response.status === 'success') {
            const searchResult = response.payload;
            if (searchResult.resultCount > 0) {
                this.searchStatus = 'Search Results';
                this.searchResultRecords = searchResult.records;
            } else {
                this.searchStatus = 'No results';
                this.searchResultRecords = [];
            }
        } else {
            showError(response.payload, this);
        }
    }

    async validateZenonRecord() {

        const response: RequestResult = await search(this.searchTerm, this.searchScope);
        if (response.status === 'success') {
            const searchResult = response.payload;
            if (searchResult.resultCount > 0) {
                this.searchStatus = 'Zenon record found';
                this.searchResultRecords = searchResult.records;
                this.zenonValidationStatus = 'is-success';
            } else {
                this.searchStatus = 'Zenon Record not found!';
                this.searchResultRecords = [];
                this.zenonValidationStatus = 'is-danger';
            }
        } else {
            showError(response.payload, this);
        }
    }

    async addZenonData(index: number) {

        const response: RequestResult = await downloadCSLJSONRecord(index.toString());
        if (response.status === 'success') {
            const cslRecord: cslJSONRecord = response.payload;

            const wasMetadataModified: boolean = (this.articleMetadata.title !== '') ||
                                                 (this.articleMetadata.date_published !== '') ||
                                                 (this.articleMetadata.author.length > 0);

            this.articleMetadata.title = cslRecord.title;
            this.articleMetadata.date_published = cslRecord.issued.raw;
            this.articleMetadata.zenonId = cslRecord.id;

            this.articleMetadata.author = [];
            cslRecord.author.forEach((author: any) => {
                this.articleMetadata.author.push({
                    firstname: author.given,
                    lastname: author.family
                });
            });

            if (wasMetadataModified) {
                showWarning('Zenon data imported - existing values were overwritten!', this);
            } else {
                showSuccess('Zenon data imported', this);
            }
        } else {
            showError(response.payload, this);
        }
    }
}
</script>
