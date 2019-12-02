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
                    label="Title">
                        {{ props.row.object.metadata.title || '-' | truncate(80) }}
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="content">
                    <ul v-if="props.row.errors.length > 0">
                        <li v-for="error in props.row.errors" :key="error">{{ error }}</li>
                    </ul>
                    <div v-else>
                        No problems found for this folder path
                    </div>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { initRecordObject } from '../RecordImportParameters';
import { getAtomRecord, AtomRecord } from '@/util/AtomClient';
import {
    checkFolderStructure, buildError, getRowClass, getTableField, ObjectRecord
} from '@/job/JobMetadataFormUtils.ts';

@Component({
    filters: {
        truncate(value: string, length: number) {
            return value.length > length
                ? `${value.substr(0, length)}...`
                : value;
        }
    }
})
export default class RecordMetadataForm extends Vue {
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
        const msg = 'Invalid name. The folder path does not match the pattern "RECORD-AID-xxxxxxx".';
        return buildError(record, msg);
    }
    const atomRecord: any = await getAtomRecord(atomId);
    if (atomRecord['id'] == 'not-found') {
        const msg = `No Record with the extracted ID "${atomId}" found.`;
        return buildError(record, msg);
    } else {
        return buildRecordRecord(record, atomRecord);
    }
}

async function buildRecordRecord(record: ObjectRecord, atomRecord: AtomRecord):
    Promise<ObjectRecord> {
    return {
        id: record.id,
        object: {
            id: record.object.id,
            path: record.object.path,
            metadata: {
                title: atomRecord.title,
                created: atomRecord.dates[0].date,
                author: [atomRecord.creators[0].authotized_form_of_name],
                atom_id: String(atomRecord.reference_code)
            }
        },
        remoteRecord: atomRecord,
        errors: record.errors
    };
}

function initRecord(path: string): ObjectRecord {
    return { id: path, object: initRecordObject(path), errors: [] };
}

function extractAtomId(path: string): string | null {
    const result = path.match(/.*RECORD-AID-(.+)/);
    if (!result || result.length < 1) return null;
    return result[1];
}
</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
