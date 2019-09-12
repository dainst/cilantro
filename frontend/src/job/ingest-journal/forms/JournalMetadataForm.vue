<template>
    <section>
        <div class="tile is-ancestor record-container">
            <div class="tile is-parent is-3" v-for="record in records" :key="record.id">
                <div
                    class="tile is-child notification"
                    v-bind:class="{ 'is-danger': record.error, 'is-success': record.zenonRecord }"
                >
                    <p class="subtitle">
                        <b-icon v-if="record.zenonRecord" icon="check"></b-icon>
                        <b-icon v-if="record.error" icon="alert-circle"></b-icon>
                        {{record.id}}
                    </p>
                    <div
                        v-if="record.zenonRecord"
                        class="content"
                    >{{ record.issue.metadata.description }}</div>
                    <div v-if="record.error" class="content">{{ record.error }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { JournalIssueMetadata, JournalIssue } from '../JournalImportParameters';
import { getRecord, ZenonRecord } from '@/util/ZenonClient';

@Component
export default class JournalMetadataForm extends Vue {
    @Prop() private issues!: JournalIssue[];

    records: Record[] = [];

    mounted() {
        const updates = this.issues.map((issue) => {
            const record = { id: issue.path, issue };
            const i = this.records.push(record) - 1;
            return populateZenonRecord(record).then((populatedRecord) => {
                Vue.set(this.records, i, populatedRecord);
                return populatedRecord.issue;
            });
        });
        Promise.all(updates).then((updatedIssues) => {
            this.$emit('update:issues', updatedIssues);
        });
    }

    labelPosition: string = 'on-border';
}

interface Record {
    id: string,
    issue: JournalIssue;
    zenonRecord?: ZenonRecord;
    error?: string;
}

function extractZenonId(path: string) {
    const result = path.match(/.*JOURNAL-ZID(\d+)/);
    if (!result || result.length < 1) throw Error('Invalid name');
    return result[1];
}

async function populateZenonRecord(record: Record): Promise<Record> {
    try {
        const zenonId = extractZenonId(record.issue.path);
        const zenonRecord = await getRecord(zenonId);
        return {
            id: record.id,
            issue: {
                path: record.issue.path,
                metadata: {
                    zenon_id: parseInt(zenonId, 10),
                    volume: '?',
                    year: 0,
                    number: '?',
                    description: zenonRecord.title,
                    identification: '?'
                }
            },
            zenonRecord
        };
    } catch (error) {
        return {
            id: record.id,
            issue: record.issue,
            error
        };
    }
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
}
</style>
