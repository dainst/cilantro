<template>
    <section>
        <b-table :data="objects" detailed detail-key="id" > <!-- :row-class="getRowClass" -->
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon v-if="isObjectError(props.row)" icon="alert-circle" type="is-danger" />
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
                <template v-if="!isObjectError(props.row) && props.row.metadata">
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
                    <ul v-if="isObjectError(props.row)">
                        <li v-for="message in props.row.messages" :key="message">{{ message }}</li>
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
import {
    ObjectError, isObjectError, getObjectFolder, containsNumberOfFiles,
    containsOnlyFilesWithSuffix
} from '@/job/JobParameters';
import {
    ObjectData, IngestArchivalMaterialParameters,
    IngestArchivalMaterialObject, IngestArchivalMaterialOptions, ArchivalMaterialMetadata
} from './IngestArchivalMaterialParameters';
import { getStagingFiles } from '@/staging/StagingClient';
import { AtomRecord, getAtomRecord } from '@/util/AtomClient';
import { WorkbenchFileTree, WorkbenchFile, getVisibleFolderContents } from '@/staging/StagingClient';

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

    objects: IngestArchivalMaterialObject[];

    constructor() {
        super();
        this.objects = [];
    }

    async mounted() {
        const stagingFiles = await getStagingFiles();

        this.objects = await asyncMap(
            this.selectedPaths, async(path) : Promise<IngestArchivalMaterialObject> => {
                const id = path.split('/').pop() || '';
                const atomId = extractAtomId(path);
                let errors: string[] = [];
                if (atomId === null) {
                    errors.push(`Could not extract Atom ID from ${path}.`);
                }

                const objectFolder = await getObjectFolder(stagingFiles, id);
                if (Object.keys(objectFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateObjectFolder(objectFolder));
                }
                if (errors.length === 0) {
                    return new ObjectData(
                        id, path, { atom_id: atomId } as ArchivalMaterialMetadata
                    );
                }
                return new ObjectError(id, path, errors);
            }
        );

        this.objects = await asyncMap(this.objects, async(object) => {
            if (object instanceof ObjectData) {           
                const updated : IngestArchivalMaterialObject = await loadAtomData(object);
                return updated;
            }
            return new ObjectError(object.id, object.path, object.messages);
        });

        this.$emit('update:objectsUpdated', this.objects);
    }

    isObjectError = isObjectError;
    labelPosition: string = 'on-border';
}

function evaluateObjectFolder(objectFolder : WorkbenchFileTree) {
    const errors: string[] = [];
    if (!containsNumberOfFiles(objectFolder, 1)) {
        errors.push(
            `Folder has more than one entry. Only one subfolder 'tif' is allowed.`
        );
    }

    if (!('tif' in objectFolder)) {
        errors.push(`Folder does not have a subfolder 'tif'.`);
    } else if (objectFolder.tif.contents !== undefined &&
                !containsOnlyFilesWithSuffix(objectFolder.tif.contents, '.tif')) {
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

async function loadAtomData(object: ObjectData) {
    try {
        const atomRecord = await getAtomRecord(object.metadata.atom_id) as AtomRecord;

        let authors: string[] = [];
        let notes: string[] = [];
        if ('notes' in atomRecord) {
            const split = splitAuthorsFromNotes(atomRecord.notes);
            // eslint-disable-next-line prefer-destructuring
            authors = split.authors;
            notes = split.other;
        }

        const metadata = {
            atom_id: object.metadata.atom_id,
            title: atomRecord.title,
            authors,
            scope_and_content: atomRecord.scope_and_content,
            repository: atomRecord.repository,
            creators: atomRecord.creators.map(
                creator => creator.authotized_form_of_name
            ),
            extent_and_medium: atomRecord.extent_and_medium,
            level_of_description: atomRecord.level_of_description,
            dates: atomRecord.dates,
            notes,
            reference_code: atomRecord.reference_code
        } as ArchivalMaterialMetadata;

        return new ObjectData(object.id, object.path, metadata);
    } catch (error) {
        return new ObjectError(object.id, object.path, [error]);
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

// TODO: Move to separate util script
function asyncMap<A, B>(
    inputValues: Array<A>,
    mappingFunction: (_: A) => Promise<B>
): Promise<Array<B>> {
    return Promise.all(inputValues.map(value => mappingFunction(value)));
}

// async function populateAtomRecords(records: ObjectRecord[]) {
//     return Promise.all(records.map(async record => populateAtomRecord(record)));
// }

// async function populateAtomRecord(record: ObjectRecord): Promise<ObjectRecord> {
//     const atomId = extractAtomId(record.object.path);
//     if (!atomId) {
//         const msg = 'Invalid name. The folder path does not match the pattern "RECORD-AID-D-xxxxxxx".';
//         return buildError(record, msg);
//     }
//     const atomRecord: any = await getAtomRecord(atomId);
//     if (atomRecord.id === 'not-found') {
//         const msg = `No Record with the extracted ID "${atomId}" found.`;
//         return buildError(record, msg);
//     }
//     return buildRecordRecord(record, atomRecord, atomId);
// }

// async function buildRecordRecord(
//     record: ObjectRecord,
//     atomRecord: AtomRecord,
//     atomId: string
// ): Promise<ObjectRecord> {
//     const builtRecord = {
//         id: record.id,
//         object: {
//             id: record.object.id,
//             path: record.object.path,
//             metadata: {
//                 title: atomRecord.title,
//                 author: [atomRecord.creators[0].authotized_form_of_name],
//                 atom_id: atomId,
//                 scope_and_content: atomRecord.scope_and_content,
//                 repository: atomRecord.repository,
//                 creators: atomRecord.creators,
//                 extent_and_medium: atomRecord.extent_and_medium,
//                 level_of_description: atomRecord.level_of_description,
//                 dates: atomRecord.dates,
//                 reference_code: atomRecord.reference_code
//             } as ArchivalMaterialMetadata
//         },
//         remoteRecord: atomRecord,
//         errors: record.errors
//     };
//     if ('date' in atomRecord.dates[0]) {
//         builtRecord.object.metadata.created = String(atomRecord.dates[0].date);
//     } else if ('start_date' in atomRecord.dates[0] && 'end_date' in atomRecord.dates[0]) {
//         builtRecord.object.metadata.created = `${atomRecord.dates[0].start_date!} - ${atomRecord.dates[0].end_date!}`;
//     }
//     return builtRecord;
// }


</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
