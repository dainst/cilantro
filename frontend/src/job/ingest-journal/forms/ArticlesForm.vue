<template>
    <section>
        <b-button @click="newArticle">New Article</b-button>
        <b-button>Import CSV</b-button>
        <ul id="article_list">
            <li v-for="(article, index) in articles">
                <ArticleDetailForm v-bind:articleData="article"
                                     v-bind:availableFiles="availableFiles" />
                 <b-button @click="deleteArticle(index)">Delete Article</b-button>
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ArticleDetailForm from './ArticleDetailForm.vue';
import {
    Part, ArticleMetadata, FileRange, Author, Pages
} from '../JournalImportParameters';

@Component({
    components: {
        ArticleDetailForm
    }
})
export default class ArticlesForm extends Vue {
    @Prop() initialData!: Part[]
    @Prop() availableFiles!: FileRange[]

    articles: Part[] = this.initialData;

    deleteArticle(index: number) {
        this.articles.splice(index, 1);
    }

    newArticle() {
        const pages = {
            showndesc: '',
            startPrint: 1,
            endPrint: 2
        } as Pages;

        const author = {
            firstname: 'author_first',
            lastname: 'author_last'
        } as Author;

        const metadata = {
            title: 'test-title',
            abstract: '',
            author: [author],
            pages,
            date_published: '2018--',
            language: 'de_DE',
            zenonId: '',
            auto_publish: true,
            create_frontpage: false
        } as ArticleMetadata;

        const files = {
            file: '',
            range: [0, 0]
        } as FileRange;

        const part = {
            metadata,
            files: [files]
        } as Part;

        this.articles.push(part);
    }
}
</script>

<style scoped lang="scss">
    li {
      display: inline-block;
      margin: 0 10px;
    }

    #article_list section {
        border-style: solid;
    }
</style>
