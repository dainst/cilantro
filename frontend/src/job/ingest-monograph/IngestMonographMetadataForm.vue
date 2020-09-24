<template>
    <b-table class="" :data="this.targets" detailed detail-key="id">
        <template slot-scope="props">
            <b-table-column style="vertical-align: middle;">
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
                label="Path"
            >{{ props.row.id }}</b-table-column>
            <template
                v-if="!isTargetError(props.row) &&
                    props.row.metadata">
                <b-table-column field="metadata.title"
                                label="Title">
                    <a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id"
                       target="_blank">
                        {{ props.row.metadata.title || '-' | truncate(80) }}
                    </a>
                </b-table-column>
                <b-table-column
                    field="metadata.subtitle"
                    label="Subtitle"
                >{{ props.row.metadata.subtitle || '-' }}
                </b-table-column>
                <b-table-column
                    field="metadata.date_published"
                    label="Date published"
                    >{{ props.row.metadata.date_published || '-' }}
                </b-table-column>
            </template>
            <template v-else>
                <b-table-column label="Title">-</b-table-column>
                <b-table-column label="Subtitle">-</b-table-column>
                <b-table-column label="Date published">-</b-table-column>
            </template>
        </template>

        <template slot="detail" slot-scope="props">
            <div class="content">
                <ul>
                    <li v-for="(id, name) in props.row.metadata" v-bind:key="name">
                        {{name}}: {{id}}
                    </li>
                </ul>
                <ul v-if="isTargetError(props.row)">
                    <li v-for="message in props.row.messages" :key="message.id">
                        {{ message }}
                    </li>
                </ul>
            </div>
        </template>
    </b-table>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
    JobTargetError, isTargetError
} from '@/job/JobParameters';
import {
    MaybeJobTarget, JobTargetData, MonographMetadata, Person
} from './IngestMonographParameters';
import { getRecord, ZenonRecord, ZenonAuthors } from '@/util/ZenonClient';
import { asyncMap } from '@/util/HelperFunctions';
import { ojsZenonMapping } from '@/config';
import {
    WorkbenchFileTree, WorkbenchFile, getVisibleFolderContents, getStagingFiles, getTargetFolder, containsNumberOfFiles, containsOnlyFilesWithSuffix
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
export default class MonographMetadataForm extends Vue {
    @Prop({ required: true }) private selectedPaths!: string[];

    targets: MaybeJobTarget[];

    constructor() {
        super();
        this.targets = [];
    }

    async mounted() {
        const stagingFiles = await getStagingFiles();

        this.targets = await asyncMap(
            this.selectedPaths, async(path) : Promise<MaybeJobTarget> => {
                const id = path.split('/').pop() || '';
                const zenonId = extractZenonId(path);
                let errors: string[] = [];
                if (zenonId === '') {
                    errors.push(`Could not extract Zenon ID from ${path}.`);
                }

                const targetFolder = await getTargetFolder(stagingFiles, path);
                if (Object.keys(targetFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateTargetFolder(targetFolder));
                }

                if (errors.length === 0) {
                    return new JobTargetData(
                        id, path, { zenon_id: zenonId } as MonographMetadata
                    );
                }
                return new JobTargetError(id, path, errors);
            }
        );

        this.targets = await asyncMap(this.targets, async(target) => {
            if (target instanceof JobTargetData) {
                return loadZenonData(target);
            }
            return new JobTargetError(target.id, target.path, target.messages);
        });

        this.$emit('update:targetsUpdated', this.targets);
    }

    isTargetError = isTargetError;
}

function evaluateTargetFolder(targetFolder : WorkbenchFileTree) {
    const errors: string[] = [];
    if (!containsNumberOfFiles(targetFolder, 1)) {
        errors.push(
            `Folder has more than one entry. Only one subfolder 'tif' is allowed.`
        );
    }

    if (!('tif' in targetFolder)) {
        errors.push(`Folder does not have a subfolder 'tif'.`);
    } else if (targetFolder.tif.contents !== undefined &&
                !containsOnlyFilesWithSuffix(targetFolder.tif.contents, '.tif')) {
        errors.push(`Subfolder 'tif' does not only contain files ending in '.tif'.`);
    }
    return errors;
}

function extractZenonId(path: string): string {
    const result = path.match(/.*Book-ZID(\d+)/i);
    if (!result || result.length < 1) return '';
    return result[1];
}

function filterDuplicateEntry(value, index, self) {
    return self.indexOf(value) === index;
}

async function loadZenonData(target: JobTargetData) : Promise<MaybeJobTarget> {
    try {
        const zenonRecord = await getRecord(target.metadata.zenon_id) as ZenonRecord;
        const errors : string[] = [];

        let datePublished = '';

        if (zenonRecord.publicationDates.length > 0) {
            try {
                [datePublished] = new Date(zenonRecord.publicationDates[0]).toISOString().split('T');
            } catch (e) {
                errors.push(`Unable to parse date: ${zenonRecord.publicationDates[0]}`);
            }
        }
        let summary = '';
        if (zenonRecord.summary.length > 0) {
            [summary] = zenonRecord.summary;
        }

        let subTitle = '';
        if (subTitle in zenonRecord) {
            subTitle = zenonRecord.subTitle.trim();
        }

        const filteredSubjects = zenonRecord.subjects
            .map(subject => subject[0])
            .filter(filterDuplicateEntry);
        const authors = extractAuthors(zenonRecord);

        if (errors.length !== 0) {
            return new JobTargetError(target.id, target.path, errors);
        }
        const metadata = {
            zenon_id: target.metadata.zenon_id,
            press_code: 'dai',
            authors,
            title: zenonRecord.shortTitle.replace(/[\s:]+$/, '').trim(),
            subtitle: subTitle,
            abstract: summary,
            date_published: datePublished,
            keywords: filteredSubjects
        } as MonographMetadata;

        return new JobTargetData(target.id, target.path, metadata);
    } catch (error) {
        return new JobTargetError(target.id, target.path, [error]);
    }
}

function extractAuthors(record: ZenonRecord) : Person[] {
    let authorsCompleteNames: string[] = [];
    if (record.primaryAuthorsNames.length !== 0) {
        authorsCompleteNames = authorsCompleteNames.concat(record.primaryAuthorsNames);
    } else if (record.secondaryAuthorsNames.length !== 0) {
        authorsCompleteNames = authorsCompleteNames.concat(record.secondaryAuthorsNames);
    } else if (record.corporateAuthorsNames.length !== 0) {
        authorsCompleteNames = authorsCompleteNames.concat(record.corporateAuthorsNames);
    }

    return authorsCompleteNames.map((authorCompleteName) => {
        const authorSplit = authorCompleteName.split(',');
        if (authorSplit.length === 2) {
            return {
                givenname: authorSplit[1].replace(/[\\.]+$/, '').trim(),
                lastname: authorSplit[0].trim()
            } as Person;
        }
        return {
            givenname: '',
            lastname: authorCompleteName
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
