<template>
    <section>
        <b-loading :is-full-page="true" :active="targets.length === 0"></b-loading>
        <b-table :data="targets" detailed detail-key="id" > <!-- :row-class="getRowClass" -->
            <template slot-scope="props">
                <b-table-column>
                    <template v-if="isTargetError(props.row)">
                        <b-icon icon='alert-circle' type="is-danger"/>
                    </template>
                    <template v-else>
                        <b-icon
                            v-if="!props.row.metadata || !props.row.metadata.title"
                            icon="loading"
                            custom-class="mdi-spin"
                        />
                        <b-icon v-if="props.row.metadata && props.row.metadata.title"
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
                            :key="name">{{name}}: {{data}}
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
/* eslint-disable class-methods-use-this */
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
    JobTargetError, isTargetError
} from '@/job/JobParameters';
import {
    JobTargetData, MaybeJobTarget, ArchivalMaterialMetadata
} from './IngestArchivalMaterialParameters';
import {
    getStagingFiles,
    StagingDirectoryContents,
    containsOnlyFilesWithExtensions,
    containsNumberOfFiles
} from '@/staging/StagingClient';
import {
    AtomResult, AtomMessage, AtomRecord, getAtomRecord
} from '@/util/AtomClient';

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

    // Required to alert parent vue component of changes
    @Watch('targets')
    onPropertyChanged(value: MaybeJobTarget[], _oldValue: MaybeJobTarget[]) {
        this.$emit('update:targetsUpdated', value);
    }

    async mounted() {
        this.targets = await Promise.all(this.selectedPaths.map(this.processSelectedPath));
        this.targets = await Promise.all(this.targets.map(async(target) => {
            if (target instanceof JobTargetData) {
                const updated : MaybeJobTarget = await this.loadAtomData(target);
                return updated;
            }
            return new JobTargetError(target.id, target.path, target.messages);
        }));
    }

    isTargetError = isTargetError;

    async processSelectedPath(path: string) {
        const id = path.split('/').pop() || '';
        const atomId = this.extractAtomId(path);
        let errors: string[] = [];
        if (atomId === null) {
            errors.push(`Could not extract Atom ID from ${path}.`);
        }

        const targetFolder = await getStagingFiles(path);
        if (Object.keys(targetFolder).length === 0) {
            errors.push(`Could not find file at ${path}.`);
        } else {
            errors = errors.concat(this.evaluateTargetFolder(targetFolder));
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

    removeTarget(removedTarget: MaybeJobTarget) {
        this.targets = this.targets.filter(target => removedTarget.id !== target.id);
    }

    evaluateTargetFolder(targetFolder : StagingDirectoryContents) {
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
        } else if (!containsOnlyFilesWithExtensions(targetFolder, ['.tif', '.tiff'])) {
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
    extractAtomId(path: string): string | null {
        const result = path.match(/.*RECORD-AID-D-(.+)/);
        if (!result || result.length < 1) return null;
        return result[1].toLowerCase();
    }

    async loadAtomData(target: JobTargetData) {
        try {
            const atomResult = await getAtomRecord(target.metadata.atom_id) as AtomResult;

            const atomMessage = atomResult as AtomMessage;

            if (atomMessage.message) {
                console.error(atomMessage);
                const msg = `Atom responded with "${atomMessage.message}" for id "${target.metadata.atom_id}".`;
                return new JobTargetError(target.id, target.path, [msg]);
            }

            // eslint-disable-next-line no-new-object
            const atomRecord = atomResult as AtomRecord;
            let authors: string[] = [];
            let notes: string[] = [];
            if (atomRecord.notes) {
                const split = this.splitAuthorsFromNotes(atomRecord.notes);
                // eslint-disable-next-line prefer-destructuring
                authors = split.authors;
                notes = split.other;
            }

            let creators: string[] = [];
            if (atomRecord.creators) {
                creators = atomRecord.creators.map(
                    creator => creator.authorized_form_of_name
                );
            }

            const metadata = {
                atom_id: target.metadata.atom_id,
                copyright: target.metadata.copyright,
                title: atomRecord.title,
                authors,
                scope_and_content: atomRecord.scope_and_content,
                repository: atomRecord.repository,
                repository_inherited_from: atomRecord.repository_inherited_from,
                creators,
                extent_and_medium: atomRecord.extent_and_medium,
                level_of_description: atomRecord.level_of_description,
                dates: atomRecord.dates,
                notes,
                reference_code: atomRecord.reference_code
            } as ArchivalMaterialMetadata;

            return new JobTargetData(target.id, target.path, metadata);
        } catch (error) {
            const msg = `Could not resolve valid Atom dataset for id ${target.metadata.atom_id}.`;
            return new JobTargetError(target.id, target.path, [msg]);
        }
    }

    splitAuthorsFromNotes(atomNotes: string[]) {
        const authors = atomNotes
            .filter(note => note != null)
            .filter(note => note.startsWith('Autor'))
            .map((authorNote) => {
                const match = authorNote.match(/Autor:\s*(.*)$/);
                if (match && match.length === 2) {
                    return match[1];
                }
                return authorNote;
            });

        const other = atomNotes
            .filter(note => note != null)
            .filter(note => !note.startsWith('Autor'));

        return { authors, other };
    }
}
</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
