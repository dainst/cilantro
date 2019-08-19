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

    async addZenonData(index: number) {
        const cslRecord: cslJSONRecord = await downloadCSLJSONRecord(index.toString());

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

        const toastConfig: any = {
            position: 'is-bottom-right',
            duration: 5000
        };
        if (wasMetadataModified) {
            toastConfig.message = 'Zenon data imported - existing values were overwritten!';
            toastConfig.type = 'is-warning';
        } else {
            toastConfig.message = 'Zenon data imported';
            toastConfig.type = 'is-success';
        }
        this.$toast.open(toastConfig);
    }
}
</script>
