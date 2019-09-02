<template>
    <section>
        <div class="columns">
            <div class="column">
                <b-field label="objectID" :label-position="labelPosition">
                    <b-input v-model="localObjectID" @blur="saveObjectID"></b-input>
                    <!-- <b-input v-model="localObjectID"></b-input> -->
                </b-field>
                <b-field label="title" :label-position="labelPosition">
                    <b-input v-model="metadata.title" required></b-input>
                </b-field>
                <b-field label="abstract" :label-position="labelPosition">
                    <b-input v-model="metadata.abstract" required></b-input>
                </b-field>
                <b-field label="description" :label-position="labelPosition">
                    <b-input v-model="metadata.description" required></b-input>
                </b-field>
                <b-field label="type" :label-position="labelPosition">
                    <b-input v-model="metadata.type" required></b-input>
                </b-field>
            </div>
            <div class="column">
                <b-field label="created" :label-position="labelPosition">
                    <b-input v-model="metadata.created" required></b-input>
                </b-field>
                <ul>
                    <li v-for="(author, index) in metadata.author">
                        <b-field label="Author">
                            <b-field label="First Name">
                                <b-input v-model="author.firstname" required></b-input>
                            </b-field>
                            <b-field label="Last Name">
                                <b-input v-model="author.lastname" required></b-input>
                            </b-field>
                        </b-field>
                        <b-button @click="metadata.author.splice(index,1)">
                            Remove Author
                        </b-button>
                    </li>
                </ul>
                <b-button icon-left="file-plus" @click="addAuthor">Add Author</b-button>

                <b-field label="identifiers" :label-position="labelPosition">
                    <ul>
                        <li v-for="(identifier, index) in metadata.identifiers" :key="identifier">
                            <b-input v-model="metadata.identifiers[index]" required></b-input>
                            <b-button @click="metadata.identifiers.splice(index,1)">
                                Remove Identifier
                            </b-button>
                        </li>
                        <b-button icon-left="file-plus" @click="addIdentifier">
                            Add Identifier
                        </b-button>
                    </ul>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BookMetadata, Author } from '../BookImportParameters';

@Component
export default class BookMetadataForm extends Vue {
    @Prop() private objectID!: string
    @Prop() private metadata!: BookMetadata

    localObjectID: string = this.objectID;

    labelPosition: string = 'on-border';

    addAuthor() {
        const author = {
            firstname: '',
            lastname: ''
        } as Author;
        this.metadata.author.push(author);
    }

    addIdentifier() {
        this.metadata.identifiers.push('');
    }

    saveObjectID() {
        this.$emit('update:objectID', this.localObjectID);
    }
}
</script>
