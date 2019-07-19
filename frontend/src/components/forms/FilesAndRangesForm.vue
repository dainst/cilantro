<template>
    <section>
        <b-button @click="newArticle">New Article</b-button>
        <b-button>Import CSV</b-button>
        <ul id="article_list">
            <li v-for="article in articles">
                <!-- <ArticleMetadataForm initialArticle="article" /> -->
                <ArticleMetadataForm v-bind:initialArticle="article" />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticleMetadataForm from '@/components/forms/ArticleMetadataForm.vue'
import store from '@/store'

@Component({
    components: {
        ArticleMetadataForm
    }
})
export default class FilesAndRangesForm extends Vue {
    articles: Object[] = []

    newArticle() {
        this.$toast.open({
            message: 'Adding new article...',
            position: 'is-top-right',
            type: 'is-success'
        })
        this.articles.push({
            ojs_journal_code: 'test_code',
            ojs_user: '',
            auto_publish_issue: false,
            default_publish_articles: true,
            default_create_frontpage: '',
            allow_upload_without_file: ''
        })
    }
}
</script>

<style scoped lang="scss">
    li {
      display: inline-block;
      margin: 0 10px;
    }
</style>
