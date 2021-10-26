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
                    field="id"
                    label="Directory name"
                >{{ props.row.id }}</b-table-column>
                <template v-if="!isTargetError(props.row) && props.row.metadata">
                    <b-table-column
                        field="metadata.title"
                        label="Title"
                    ><a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id" target="_blank">
                        {{ props.row.metadata.title || '-' | truncate(80) }}
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

                <div class="columns">
                    <div class="column">
                        <b-field label="OJS journal code">
                            {{props.row.metadata.ojs_journal_code}}
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="Publishing year">
                            <b-input v-model="props.row.metadata.publishing_year"></b-input>
                        </b-field>
                    </div>
                </div>
                <b-field label="Issue title">
                    <a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id" target="_blank">
                        {{ props.row.metadata.title }}
                    </a>
                </b-field>
                <div class="box">
                    <b-notification :closable="false">
                        Suggestions based on Zenon data:
                        "{{ zenonDataMapping[props.row.metadata.zenon_id].partOrSectionInfo || '-' }}"
                    </b-notification>

                    <div class="columns">
                        <div class="column">
                            <b-field label="Issue number">
                                <b-input v-model="props.row.metadata.issue"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Volume number">
                                <b-input v-model="props.row.metadata.volume"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Reporting year">
                                <b-input v-model="props.row.metadata.reporting_year"></b-input>
                            </b-field>
                        </div>
                    </div>
                </div>

                <b-field label="Articles" v-if="props.row.metadata.articles.length !== 0">
                    <div class="box">
                        <div class="box" v-for="(article, index) in props.row.metadata.articles" :key="index">
                            <b-field label="Title">
                                <a :href="'https://zenon.dainst.org/Record/' + article.zenon_id" target="_blank">
                                    {{ article.title }}
                                </a>
                            </b-field>
                            <b-field  v-if="article.authors.length !== 0" label="Authors">
                            <table>
                                <tbody>
                                    <tr v-for="(author, index) in article.authors" :key="index">
                                        <td><b-input placeholder="given name" v-model="author.givenname"></b-input></td>
                                        <td><b-input placeholder="last name" v-model="author.lastname"></b-input></td>
                                    </tr>
                                </tbody>
                            </table>
                            </b-field>
                        </div>
                    </div>
                </b-field>
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
import { asyncMap } from '@/util/HelperFunctions';
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
    @Prop({ required: true }) private selectedPaths!: string[];
    targets: MaybeJobTarget[];
    zenonDataMapping: {[index: string]: ZenonRecord}

    constructor() {
        super();
        this.targets = [];
        this.zenonDataMapping = {};
    }

    async mounted() {
        this.targets = await asyncMap(
            this.selectedPaths, async(path) : Promise<MaybeJobTarget> => {
                const id = path.split('/').pop() || '';
                const issueZenonId = extractZenonId(path);
                let errors: string[] = [];
                if (issueZenonId === '') {
                    errors.push(`Could not extract Zenon ID from ${path}.`);
                }

                const targetFolder = await getStagingFiles(path);
                if (Object.keys(targetFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateTargetFolder(targetFolder));
                }

                const articleZenonIds = Object.keys(targetFolder)
                    .map(name => extractZenonId(name))
                    .filter(zenonId => zenonId !== '');

                if (errors.length !== 0) {
                    return new JobTargetError(id, path, errors);
                }

                return this.loadZenonData(id, path, issueZenonId, articleZenonIds);
            }
        );

        this.$emit('update:targetsUpdated', this.targets);
    }

    isTargetError = isTargetError;

    removeTarget(removedTarget: MaybeJobTarget) {
        this.targets = this.targets.filter(target => removedTarget.id !== target.id);
        this.$emit('update:targetsUpdated', this.targets);
    }

    async loadZenonData(
        targetId: string, targetPath: string, issueZenonId: string, articleZenonIds: string[]
    ) {
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

            const articleRecords = await asyncMap(articleZenonIds, getRecord);

            let publicationDate;
            if (zenonRecord.publicationDates.length !== 0) {
                [publicationDate] = zenonRecord.publicationDates;
            }

            const metadata = {
                zenon_id: issueZenonId,
                volume: zenonRecord.serialMetadata?.volume,
                publishing_year: publicationDate,
                number: zenonRecord.serialMetadata?.issue,
                title: zenonRecord.title,
                ojs_journal_code: ojsZenonMapping[parentId],
                reporting_year: zenonRecord.serialMetadata?.year,
                articles: createArticleMetadata(articleRecords)
            } as JournalIssueMetadata;

            return new JobTargetData(targetId, targetPath, metadata);
        } catch (error) {
            return new JobTargetError(targetId, targetPath, [error]);
        }
    }
}

function evaluateTargetFolder(targetFolder : WorkbenchFileTree) {
    const errors: string[] = [];
    if (containsNumberOfFiles(targetFolder, 0)) {
        errors.push(
            `Folder appears to be empty. Please provide input data.`
        );
    }

    if (('tif' in targetFolder)) {
        // if there is a tif folder, make sure it only contains tifs
        if (targetFolder.tif.contents !== undefined &&
                !containsOnlyFilesWithExtensions(targetFolder.tif.contents, ['.tif', '.tiff'])) {
            errors.push(`Subfolder 'tif' does not exclusively contain TIF files.`);
        }
    } else {
        errors.push(`No Subfolder 'tif' found.`);
    }
    return errors;
}

function extractZenonId(path: string): string {
    const result = path.match(/.*JOURNAL-ZID(\d+)/i);
    if (!result || result.length < 1) return '';
    return result[1];
}

function createArticleMetadata(articleRecords : ZenonRecord[]) : JournalArticleMetadata[] {
    return articleRecords.map((record : ZenonRecord) => ({
        zenon_id: record.id,
        title: record.title,
        authors: extractAuthors(record)
    }) as JournalArticleMetadata);
}

function extractAuthors(record: ZenonRecord) : Person[] {
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

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
