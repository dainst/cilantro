<template>
    <section>
        <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">

                <b-field tile is-child>
                    <ul id="article_list">
                        <li v-for="(file, index) in articleData.files">
                            <b-field label="File">
                                <b-select placeholder="Select a file"
                                          @input="updateFile(index, $event, file)">
                                    <option v-for="file in availableFiles"
                                            :value="file.file"
                                            :key="file.file">
                                        {{ file.file }}
                                    </option>
                                </b-select>
                            </b-field>
                            <b-field label="Start Page">
                                <b-numberinput v-model="file.range[0]"></b-numberinput>
                            </b-field>
                            <b-field label="End Page">
                                <b-numberinput v-model="file.range[1]"></b-numberinput>
                            </b-field>
                        </li>
                    </ul>
                    <b-button icon-left="file-plus" @click="addFile">Add File</b-button>
                </b-field>

                <b-field tile is-child>
                    <b-field label="title">
                        <b-input v-model="initialData.metadata.title"></b-input>
                    </b-field>
                    <b-field label="abstract">
                        <b-input v-model="initialData.metadata.abstract"></b-input>
                    </b-field>
                </b-field>

                <b-field tile is-child>
                    <b-field label="Author">
                        <b-field label="First Name">
                            <b-input v-model="initialData.metadata.author.firstname"></b-input>
                        </b-field>
                        <b-field label="Last Name">
                            <b-input v-model="initialData.metadata.author.lastname"></b-input>
                        </b-field>
                    </b-field>

                    <b-field label="Pages">
                        <b-field label="showndesc">
                            <b-input v-model="initialData.metadata.pages.showndesc"></b-input>
                        </b-field>
                        <b-field label="startPrint">
                            <b-input v-model="initialData.metadata.pages.startPrint"></b-input>
                        </b-field>
                        <b-field label="endPrint">
                            <b-input v-model="initialData.metadata.pages.endPrint"></b-input>
                        </b-field>
                    </b-field>
                </b-field>

                <b-field tile is-child>
                    <b-field label="date_published">
                        <b-switch v-model="initialData.metadata.date_published"></b-switch>
                    </b-field>
                    <b-field label="language">
                        <b-input v-model="initialData.metadata.language"></b-input>
                    </b-field>
                    <b-field label="zenonId">
                        <b-input v-model="initialData.metadata.zenonId"></b-input>
                    </b-field>
                    <b-field label="auto_publish">
                        <b-switch v-model="initialData.metadata.auto_publish"></b-switch>
                    </b-field>
                    <b-field label="create_frontpage">
                        <b-switch v-model="initialData.metadata.create_frontpage"></b-switch>
                    </b-field>
                </b-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Part, FileRange } from '../JobParameters';

@Component
export default class ArticleMetadataForm extends Vue {
    @Prop() private initialData!: Part
    @Prop() private availableFiles!: FileRange

    updateFile(index: number, event: any, file: FileRange) {
        this.articleData.files[index].file = event;
        this.articleData.files[index].range = file.range;
    }

    addFile() {
        const file = {
            file: '',
            range: [0, 0]
        } as FileRange;
        this.articleData.files.push(file);
    }
}
</script>
