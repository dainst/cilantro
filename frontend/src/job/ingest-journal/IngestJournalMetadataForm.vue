<template>
    <section>
        <b-table :data="this.targets" detailed detail-key="id">
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon v-if="isTargetError(props.row)" icon="alert-circle" type="is-danger" />
                    <template v-else>
                        <b-icon
                            v-if="!props.row.metadata"
                            icon="loading"
                            custom-class="mdi-spin"/>
                        <b-icon
                            v-else
                            icon="check"
                            type="is-success"
                        />
                    </template>
                </b-table-column>
                <b-table-column
                    field="path"
                    label="Directory"
                >{{ props.row.path }}</b-table-column>
                <template v-if="!isTargetError(props.row) && props.row.metadata">
                    <b-table-column
                        field="metadata.title"
                        label="Title"
                    ><a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id" target="_blank">
                        {{ (getIssueHeading(props.row.metadata) || '-') | truncate(80) }}
                    </a>
                    <b-tag
                        v-if="props.row.metadata.articles.length === 0"
                        type="is-warning"
                        size="is-medium"
                    >
                        No articles found!
                    </b-tag>

                    </b-table-column>
                </template>
                <template v-else>
                    <b-table-column label="Title">-</b-table-column>
                </template>
                <b-table-column label="">
                    <b-button title="Remove from selection"
                              type="is-text"
                              @click="removeTarget(props.row)">
                        <b-icon icon="close"/>
                    </b-button>
                </b-table-column>
            </template>

            <template slot="detail" slot-scope="props">
                <ul v-if="isTargetError(props.row)">
                    <li v-for="message in props.row.messages" :key="message">{{ message }}</li>
                </ul>

                <div v-if="!isTargetError(props.row)">
                    <div class="columns">
                        <div class="column">
                            <b-field label="OJS journal code">
                                {{props.row.metadata.ojs_journal_code}} /
                                <a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id" target="_blank">
                                    View in Zenon
                                </a>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Publishing year">
                                <b-input v-model="props.row.metadata.publishing_year"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <b-field label="Issue title">
                        <b-input v-model="props.row.metadata.title"></b-input>
                    </b-field>
                    <div class="box">
                        <b-notification :closable="false">
                            Suggestions based on Zenon data:
                            "{{getPartOrSectionInfo(props.row.metadata.zenon_id)}}"
                        </b-notification>

                        <div class="columns">
                            <div class="column">
                                <b-field label="Issue number">
                                    <b-input v-model.number="
                                        props.row.metadata.number
                                    "></b-input>
                                </b-field>
                            </div>
                            <div class="column">
                                <b-field label="Volume number">
                                    <b-input v-model.number="
                                        props.row.metadata.volume
                                    "></b-input>
                                </b-field>
                            </div>
                            <div class="column">
                                <b-field label="Reporting year">
                                    <b-input v-model.number="
                                        props.row.metadata.reporting_year
                                    "></b-input>
                                </b-field>
                            </div>
                        </div>
                    </div>

                    <b-field label="Articles" v-if="props.row.metadata.articles.length !== 0">
                        <div class="box">
                            <div
                                class="box"
                                v-for="article in getArticleMetadata(props.row.metadata)"
                                :key="article.zenon_id">
                                <b-field label="Title">
                                    <a :href="'https://zenon.dainst.org/Record/' + article.zenon_id" target="_blank">
                                        {{ article.title }}
                                    </a>
                                </b-field>
                                <b-field label="Pages">
                                    {{ article.pages || 'No Zenon data provided.' }}
                                </b-field>
                                <b-field  v-if="article.authors.length !== 0" label="Authors">
                                <table>
                                    <tbody>
                                        <tr v-for="(author, index) in article.authors" :key="index">
                                            <td><b-input
                                                placeholder="given name"
                                                v-model="author.givenname">
                                            </b-input></td>
                                            <td><b-input
                                                placeholder="last name"
                                                v-model="author.lastname">
                                            </b-input></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </b-field>
                            </div>
                        </div>
                    </b-field>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
    JobTargetError, isTargetError
} from '@/job/JobParameters';
import {
    MaybeJobTarget, JobTargetData, JournalIssueMetadata, JournalArticleMetadata, Person
} from './IngestJournalParameters';
import { getRecord, ZenonRecord, Author } from '@/util/ZenonClient';
import { ojsZenonMapping } from '@/config';
import {
    WorkbenchFileTree,
    containsOnlyFilesWithExtensions,
    getStagingFiles,
    containsNumberOfFiles
} from '@/staging/StagingClient';

@Component({
    filters: {
        truncate(value: string, length: number) {
            return value.length > length
                ? `${value.substr(0, length)}...`
                : value;
        }
    }
})
export default class JournalMetadataForm extends Vue {
    /* eslint-disable class-methods-use-this */
    @Prop({ required: true }) private selectedPaths!: string[];
    targets: MaybeJobTarget[];
    zenonDataMapping: {[index: string]: ZenonRecord}

    constructor() {
        super();
        this.targets = [];
        this.zenonDataMapping = {};
    }

    // Required to alert parent vue component of changes
    @Watch('targets')
    onPropertyChanged(value: MaybeJobTarget[], _oldValue: MaybeJobTarget[]) {
        this.$emit('update:targetsUpdated', value);
    }

    async mounted() {
        this.targets = await Promise.all(this.selectedPaths.map(this.processSelectedPath));
    }

    isTargetError = isTargetError;

    removeTarget(removedTarget: MaybeJobTarget) {
        this.targets = this.targets.filter(target => removedTarget.id !== target.id);
    }

    async processSelectedPath(path: string) {
        const id = path.split('/').pop() || '';
        const issueZenonId = this.extractZenonId(path);
        let errors: string[] = [];
        if (issueZenonId === '') {
            errors.push(`Could not extract Zenon ID from ${path}.`);
        }

        const targetFolder = await getStagingFiles(path, 2);

        if (Object.keys(targetFolder).length === 0) {
            errors.push(`Could not find file at ${path}.`);
        } else {
            errors = errors.concat(this.evaluateTargetFolder(targetFolder));
        }

        const articleZenonIds = Object.keys(targetFolder)
            .map(name => this.extractZenonId(name))
            .filter(zenonId => zenonId !== '');

        articleZenonIds.forEach((articleId) => {
            const { contents } = targetFolder[`JOURNAL-ZID${articleId}`];
            if (contents) {
                errors = errors.concat(this.evaluateTargetFolder(contents));
            }
        });

        if (errors.length !== 0) {
            return new JobTargetError(id, path, errors);
        }
        return this.loadZenonData(id, path, issueZenonId, articleZenonIds);
    }

    async loadZenonData(
        targetId: string, targetPath: string, issueZenonId: string, articleZenonIds: string[]
    ) : Promise<JobTargetData | JobTargetError> {
        try {
            const zenonRecord = await getRecord(issueZenonId) as ZenonRecord;
            const errors : string[] = [];

            let parentId = '';
            if (!zenonRecord.parentId) {
                errors.push(`Zenon record has no parent id. Can't determine which Journal this issue belongs to.`);
            } else if (!(zenonRecord.parentId in ojsZenonMapping)) {
                errors.push(`Missing OJS Journal code for Journal with Zenon-ID '${zenonRecord.parentId}'.`);
            } else {
                // eslint-disable-next-line prefer-destructuring
                parentId = zenonRecord.parentId;
            }

            this.zenonDataMapping[issueZenonId] = zenonRecord;

            if (errors.length !== 0) return new JobTargetError(targetId, targetPath, errors);

            const articleRecords = await Promise.all(articleZenonIds.map(getRecord));

            let publicationDate;
            if (zenonRecord.publicationDates.length !== 0) {
                [publicationDate] = zenonRecord.publicationDates;
            }

            const metadata = {
                zenon_id: issueZenonId,
                journal_name: zenonRecord.title,
                volume: zenonRecord.serialMetadata?.volume,
                publishing_year: publicationDate,
                number: zenonRecord.serialMetadata?.issue,
                title: (zenonRecord.partOrSectionInfo)
                    ? zenonRecord.partOrSectionInfo : zenonRecord.title,
                ojs_journal_code: ojsZenonMapping[parentId],
                reporting_year: zenonRecord.serialMetadata?.year,
                articles: articleRecords.map(record => this.createArticleMetadata(record))
            } as JournalIssueMetadata;

            return new JobTargetData(targetId, targetPath, metadata);
        } catch (error) {
            return new JobTargetError(targetId, targetPath, [error]);
        }
    }

    getIssueHeading(issueData: JournalIssueMetadata) : string {
        return `${issueData.title} / ${issueData.journal_name}`;
    }

    getArticleMetadata(issueData: JournalIssueMetadata) : JournalArticleMetadata[] {
        return issueData.articles ? issueData.articles : [];
    }

    getPartOrSectionInfo(zenonId: string) : string {
        return this.zenonDataMapping[zenonId].partOrSectionInfo ? this.zenonDataMapping[zenonId].partOrSectionInfo : '-';
    }

    evaluateTargetFolder(targetFolder : WorkbenchFileTree) {
        const errors: string[] = [];
        if (containsNumberOfFiles(targetFolder, 0)) {
            errors.push(
                `Folder appears to be empty. Please provide input data.`
            );
        }

        if (('tif' in targetFolder)) {
        // if there is a tif folder, make sure it only contains tifs
            if (targetFolder.tif.contents &&
                !containsOnlyFilesWithExtensions(targetFolder.tif.contents, ['.tif', '.tiff'])) {
                errors.push(`Subfolder 'tif' does not exclusively contain TIF files.`);
            }
        } else {
            errors.push(`No Subfolder 'tif' found.`);
        }
        return errors;
    }

    extractZenonId(path: string): string {
        const result = path.match(/.*JOURNAL-ZID(\d+)/i);
        if (!result || result.length < 1) return '';
        return result[1];
    }

    createArticleMetadata(record : ZenonRecord) : JournalArticleMetadata {
        return ({
            path: `JOURNAL-ZID${record.id}`,
            zenon_id: record.id,
            title: record.title,
            authors: this.extractAuthors(record),
            abstracts: record.summary,
            pages: record.pages
        }) as JournalArticleMetadata;
    }

    extractAuthors(record: ZenonRecord) : Person[] {
        return record.authors.map((author : Author) => {
            const authorSplit = author.name.split(',');
            if (authorSplit.length === 2 || authorSplit.length === 3) {
                return {
                    givenname: authorSplit[1].replace(/[\\.]+$/, '').trim(),
                    lastname: authorSplit[0].trim()
                } as Person;
            }
            return {
                givenname: '',
                lastname: author.name
            } as Person;
        });
    }
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
