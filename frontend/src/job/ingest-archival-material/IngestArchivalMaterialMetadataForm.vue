<template>
    <section>
        <b-table :data="targets" detailed detail-key="id" > <!-- :row-class="getRowClass" -->
            <template slot-scope="props">
                <b-table-column>
                    <template v-if="isTargetError(props.row)">
                        <b-icon icon='alert-circle' type="is-danger"/>
                    </template>
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

                    <b-table-column field="copyright" label="Copyright">
                        <b-field>
                            <b-input placeholder="No copyright statement"
                                     v-model="props.row.metadata.copyright">
                            </b-input>
                        </b-field>
                    </b-table-column>
                </template>
                <template v-else>
                    <b-table-column label="Title">-</b-table-column>
                    <b-table-column label="Copyright">-</b-table-column>
                </template>

                <b-table-column label="">
                    <b-button title="Remove from selection"
                              class="button"
                              type="is-text"
                              @click="removeTarget(props.row)">
                        <b-icon icon="close"/>
                    </b-button>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="content metadata_output">
                    <ul>
                        <li
                            v-for="(data, name) in props.row.metadata"
                            :key="data">{{name}}: {{data}}
                        </li>
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
    Component, Vue, Prop,
} from 'vue-property-decorator';
import {
    JobTargetError, isTargetError
} from '@/job/JobParameters';
import {
    JobTargetData, MaybeJobTarget, ArchivalMaterialMetadata
} from './IngestArchivalMaterialParameters';
import {
    getStagingFiles,
    WorkbenchFileTree,
    containsOnlyVisibleFilesWithExtensions,
    getTargetFolder,
    containsNumberOfFiles,
    containsOnlyFilesWithSuffix
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
    @Prop({ required: true }) private defaultCopyright!: string;
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

                const targetFolder = await getTargetFolder(stagingFiles, path);
                if (Object.keys(targetFolder).length === 0) {
                    errors.push(`Could not find file at ${path}.`);
                } else {
                    errors = errors.concat(evaluateTargetFolder(targetFolder));
                }
                if (errors.length === 0) {
                    return new JobTargetData(
                        id, path, {
                            atom_id: atomId, copyright: this.defaultCopyright
                        } as ArchivalMaterialMetadata
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
            !containsOnlyFilesWithSuffix(targetFolder.tif.contents, '.tif')) {
            errors.push(`Subfolder 'tif' does not exclusively contain TIF files.`);
        }
    } else if (!containsOnlyVisibleFilesWithExtensions(targetFolder, ['.tif', '.tiff'])) {
        errors.push(`Selected folder neither contains subfolder 'tif', nor itself exclusively TIF files.`);
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
            copyright: target.metadata.copyright,
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
