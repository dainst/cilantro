<template>
    <section>
        <b-table :data="records" detailed detail-key="id" :row-class="getRowClass">
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon
                        v-if="props.row.remoteRecord && !props.row.errors.length"
                        icon="check"
                        type="is-success"
                    />
                    <b-icon v-if="props.row.errors.length" icon="alert-circle" type="is-danger" />
                    <b-icon
                        v-if="!props.row.errors.length && !props.row.remoteRecord"
                        icon="loading"
                        custom-class="mdi-spin"
                    />
                </b-table-column>
                <b-table-column field="id" label="Path">{{ props.row.id }}</b-table-column>
                <b-table-column
                    field="object.metadata.title"
                    label="Title"
                >{{ props.row.object.metadata.title || '-' | truncate(80) }}
                </b-table-column>
                <b-table-column
                    field="object.metadata.repository"
                    label="Repository"
                >{{ props.row.object.metadata.repository || '-' | truncate(80) }}
                </b-table-column>
                <b-table-column
                    field="object.metadata.reference_code"
                    label="Reference code"
                >{{ props.row.object.metadata.reference_code || '-' | truncate(80) }}
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="content">
                    <ul v-if="props.row.errors.length > 0">
                        <li v-for="error in props.row.errors" :key="error">{{ error }}</li>
                    </ul>
                    <div v-else>No problems found for this folder path</div>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { initRecordObject, ArchivalMaterialMetadata } from '../IngestArchivalMaterialParameters';
import { getAtomRecord, AtomRecord } from '@/util/AtomClient';
import {
    checkFolderStructure, buildError, getRowClass, getTableField, ObjectRecord
} from '@/job/JobMetadataFormUtils';

@Component({
    filters: {
        truncate(value: string, length: number) {
            return value.length > length
                ? `${value.substr(0, length)}...`
                : value;
        }
    }
})
export default class ArchivalMaterialMetadataForm extends Vue {
    @Prop({ required: true }) private selectedPaths!: string[];

    records: ObjectRecord[] = [];

    async mounted() {
        this.records = this.selectedPaths.map(path => initRecord(path));
        this.records = await checkFolderStructure(this.records);
        this.records = await populateAtomRecords(this.records);
        this.$emit('update:records', this.records.filter(r => !r.errors.length).map(r => r.object));
    }

    getRowClass = getRowClass;
    getTableField = getTableField;
    labelPosition: string = 'on-border';
}

async function populateAtomRecords(records: ObjectRecord[]) {
    return Promise.all(records.map(async record => populateAtomRecord(record)));
}

async function populateAtomRecord(record: ObjectRecord): Promise<ObjectRecord> {
    const atomId = extractAtomId(record.object.path);
    if (!atomId) {
        const msg = 'Invalid name. The folder path does not match the pattern "RECORD-AID-D-xxxxxxx".';
        return buildError(record, msg);
    }
    const atomRecord: any = await getAtomRecord(atomId);
    if (atomRecord.id === 'not-found') {
        const msg = `No Record with the extracted ID "${atomId}" found.`;
        return buildError(record, msg);
    }
    return buildRecordRecord(record, atomRecord, atomId);
}

async function buildRecordRecord(
    record: ObjectRecord,
    atomRecord: AtomRecord,
    atomId: string
): Promise<ObjectRecord> {
    const builtRecord = {
        id: record.id,
        object: {
            id: record.object.id,
            path: record.object.path,
            metadata: {
                title: atomRecord.title,
                author: [atomRecord.creators[0].authotized_form_of_name],
                atom_id: atomId,
                scope_and_content: atomRecord.scope_and_content,
                repository: atomRecord.repository,
                creators: atomRecord.creators,
                extent_and_medium: atomRecord.extent_and_medium,
                level_of_description: atomRecord.level_of_description,
                dates: atomRecord.dates,
                reference_code: atomRecord.reference_code,
            } as ArchivalMaterialMetadata
        },
        remoteRecord: atomRecord,
        errors: record.errors
    };
    if ('date' in atomRecord.dates[0]) {
        builtRecord.object.metadata.created = String(atomRecord.dates[0].date);
    } else if ('start_date' in atomRecord.dates[0] && 'end_date' in atomRecord.dates[0]) {
        builtRecord.object.metadata.created = `${atomRecord.dates[0].start_date!} - ${atomRecord.dates[0].end_date!}`;
    }
    return builtRecord;
}

function initRecord(path: string): ObjectRecord {
    return { id: path, object: initRecordObject(path), errors: [] };
}

/**
 * Converts the folder name to an AtoM slug
 *
 * AtoM slugs are always lowercase and start with
 * 'de-' whereas folder names start with 'D-'.
 */
function extractAtomId(path: string): string | null {
    const result = path.match(/.*RECORD-AID-D-(.+)/);
    if (!result || result.length < 1) return null;
    return `de-${result[1].toLowerCase()}`;
}
</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
