<template>
    <section>
        <b-table :data="targets" detailed detail-key="id" > <!-- :row-class="getRowClass" -->
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon v-if="isTargetError(props.row)" icon="alert-circle" type="is-danger" />
                    <template v-else>
                        <b-icon
                            v-if="!props.row.metadata"
                            icon="loading"
                            custom-class="mdi-spin"
                        />
                        <b-icon
                            icon="check"
                            type="is-success"
                        />
                    </template>
                </b-table-column>
                <b-table-column field="id" label="Path">{{ props.row.id }}</b-table-column>
                <template v-if="!isTargetError(props.row) && props.row.metadata">
                    <b-table-column
                        field="metadata.title"
                        label="Title"
                    >{{ props.row.metadata.title || '-' | truncate(80) }}
                    </b-table-column>
                    <b-table-column
                        field="metadata.repository"
                        label="Repository"
                    >{{ props.row.metadata.repository || '-' | truncate(80) }}
                    </b-table-column>
                    <b-table-column
                        field="metadata.reference_code"
                        label="Reference code"
                    >{{ props.row.metadata.reference_code || '-' | truncate(80) }}
                    </b-table-column>
                </template>
                <template v-else>
                    <b-table-column label="Title">-</b-table-column>
                    <b-table-column label="Repository">-</b-table-column>
                    <b-table-column label="Reference code">-</b-table-column>
                </template>

            </template>
            <template slot="detail" slot-scope="props">
                <div class="content">
                    <ul>
                        <li v-for="(data, name) in props.row.metadata" :key="data">{{name}}: {{data}}</li>
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
    JobTargetError, isTargetError, getTargetFolder, containsNumberOfFiles,
    containsOnlyFilesWithSuffix
} from '@/job/JobParameters';
import {
    JobTargetData, MaybeJobTarget, ArchivalMaterialMetadata
} from './IngestArchivalMaterialParameters';
import {
    getStagingFiles, WorkbenchFileTree, WorkbenchFile
} from '@/staging/StagingClient';
import { AtomRecord, getAtomRecord } from '@/util/AtomClient';
import { asyncMap } from '@/util/HelperFunctions';

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
                const atomId = extractAtomId(path);
                let errors: string[] = [];
                if (atomId === null) {
                    errors.push(`Could not extract Atom ID from ${path}.`);
                }

                const targetFolder = await getTargetFolder(stagingFiles, id);
                if (Object.keys(targetFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateTargetFolder(targetFolder));
                }
                if (errors.length === 0) {
                    return new JobTargetData(
                        id, path, { atom_id: atomId } as ArchivalMaterialMetadata
                    );
                }
                return new JobTargetError(id, path, errors);
            }
        );

        this.targets = await asyncMap(this.targets, async(target) => {
            if (target instanceof JobTargetData) {
                const updated : MaybeJobTarget = await loadAtomData(target);
                return updated;
            }
            return new JobTargetError(target.id, target.path, target.messages);
        });

        this.$emit('update:targetsUpdated', this.targets);
    }

    isTargetError = isTargetError;
    labelPosition: string = 'on-border';
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

async function loadAtomData(target: JobTargetData) {
    try {
        const atomRecord = await getAtomRecord(target.metadata.atom_id) as AtomRecord;

        let authors: string[] = [];
        let notes: string[] = [];
        if ('notes' in atomRecord) {
            const split = splitAuthorsFromNotes(atomRecord.notes);
            // eslint-disable-next-line prefer-destructuring
            authors = split.authors;
            notes = split.other;
        }

        const metadata = {
            atom_id: target.metadata.atom_id,
            title: atomRecord.title,
            authors,
            scope_and_content: atomRecord.scope_and_content,
            repository: atomRecord.repository,
            repository_inherited_from: atomRecord.repository_inherited_from,
            creators: atomRecord.creators.map(
                creator => creator.authotized_form_of_name
            ),
            extent_and_medium: atomRecord.extent_and_medium,
            level_of_description: atomRecord.level_of_description,
            dates: atomRecord.dates,
            notes,
            reference_code: atomRecord.reference_code
        } as ArchivalMaterialMetadata;

        return new JobTargetData(target.id, target.path, metadata);
    } catch (error) {
        return new JobTargetError(target.id, target.path, [error]);
    }
}

function splitAuthorsFromNotes(atomNotes: string[]) {
    const authors = atomNotes
        .filter(note => note.startsWith('Autor'))
        .map((authorNote) => {
            const match = authorNote.match(/Autor:\s*(.*)$/);
            if (match && match.length === 2) {
                return match[1];
            }
            return authorNote;
        });
    const other = atomNotes.filter(note => !note.startsWith('Autor'));

    return { authors, other };
}
</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
