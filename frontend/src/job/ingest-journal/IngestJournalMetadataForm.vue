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
                    label="Path"
                >{{ props.row.id }}</b-table-column>
                <template v-if="!isTargetError(props.row) && props.row.metadata">
                    <b-table-column
                        field="metadata.description"
                        label="Description"
                    >{{ props.row.metadata.description || '-' | truncate(80) }}</b-table-column>
                    <b-table-column
                        field="metadata.volume"
                        label="Volume"
                        >{{ props.row.metadata.volume || '-' }}
                    </b-table-column>
                    <b-table-column
                        field="metadata.publishing_year"
                        label="Year"
                        >{{ props.row.metadata.publishing_year || '-' }}
                    </b-table-column>
                    <b-table-column
                        field="metadata.number"
                        label="Number"
                        >{{ props.row.metadata.number || '-' }}
                    </b-table-column>
                    <b-table-column
                        field="metadata.zenon_link"
                        label="Zenon"
                    ><a :href="'https://zenon.dainst.org/Record/' + props.row.metadata.zenon_id">
                        {{props.row.metadata.zenon_id}}</a>
                    </b-table-column>
                </template>
                <template v-else>
                    <b-table-column label="Description">-</b-table-column>
                    <b-table-column label="Volume">-</b-table-column>
                    <b-table-column label="Year">-</b-table-column>
                    <b-table-column label="Number">-</b-table-column>
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
                <div class="content metadata_output">
                    <ul>
                        <li v-for="(id, name) in props.row.metadata" :key="id">{{name}}: {{id}}</li>
                    </ul>
                    <ul v-if="isTargetError(props.row)">
                        <li v-for="message in props.row.messages" :key="message">{{ message }}</li>
                    </ul>
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
    MaybeJobTarget, JobTargetData, JournalIssueMetadata
} from './IngestJournalParameters';
import { getRecord, ZenonRecord } from '@/util/ZenonClient';
import { asyncMap } from '@/util/HelperFunctions';
import { ojsZenonMapping } from '@/config';
import {
    WorkbenchFileTree,
    WorkbenchFile,
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

    constructor() {
        super();
        this.targets = [];
    }

    async mounted() {
        this.targets = await asyncMap(
            this.selectedPaths, async(path) : Promise<MaybeJobTarget> => {
                const id = path.split('/').pop() || '';
                const zenonId = extractZenonId(path);
                let errors: string[] = [];
                if (zenonId === '') {
                    errors.push(`Could not extract Zenon ID from ${path}.`);
                }

                const targetFolder = await getStagingFiles(path);
                if (Object.keys(targetFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateTargetFolder(targetFolder));
                }

                if (errors.length === 0) {
                    return new JobTargetData(
                        id, path, { zenon_id: zenonId } as JournalIssueMetadata
                    );
                }
                return new JobTargetError(id, path, errors);
            }
        );

        this.targets = await asyncMap(this.targets, async(target) => {
            if (target instanceof JobTargetData) {
                const updated : MaybeJobTarget = await loadZenonData(target);
                return updated;
            }
            return new JobTargetError(target.id, target.path, target.messages);
        });

        this.$emit('update:targetsUpdated', this.targets);
    }

    isTargetError = isTargetError;

    removeTarget(removedTarget: MaybeJobTarget) {
        this.targets = this.targets.filter(target => removedTarget.id !== target.id);
        this.$emit('update:targetsUpdated', this.targets);
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

async function loadZenonData(target: JobTargetData) {
    try {
        const zenonRecord = await getRecord(target.metadata.zenon_id) as ZenonRecord;
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

        if (errors.length !== 0) return new JobTargetError(target.id, target.path, errors);

        const metadata = {
            zenon_id: target.metadata.zenon_id,
            volume: getSerialVolume(zenonRecord),
            publishing_year: parseInt(zenonRecord.publicationDates[0], 10),
            number: getIssueNumber(zenonRecord),
            description: zenonRecord.title,
            ojs_journal_code: ojsZenonMapping[parentId],
            reporting_year: getReportingYear(zenonRecord)
        } as JournalIssueMetadata;

        return new JobTargetData(target.id, target.path, metadata);
    } catch (error) {
        return new JobTargetError(target.id, target.path, [error]);
    }
}

function getReportingYear(record: ZenonRecord): number {
    const match = record.partOrSectionInfo.match(/\(.*?\)/g)![0];
    return parseInt(match.slice(1, -1), 10);
}

function getIssueNumber(record: ZenonRecord): number {
    if (!record.partOrSectionInfo.includes(',')) {
        return 0;
    }
    const match = record.partOrSectionInfo.match(/,[^(]*/g)![0];
    return parseInt(match.slice(1), 10);
}

function getSerialVolume(record: ZenonRecord): number {
    let match: string = '';
    if (record.partOrSectionInfo.includes(',')) {
        // eslint-disable-next-line prefer-destructuring
        match = record.partOrSectionInfo.match(/[^,]*/g)![0];
    } else {
        // eslint-disable-next-line prefer-destructuring
        match = record.partOrSectionInfo.match(/[^(]*/g)![0];
    }
    return parseInt(match, 10);
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
