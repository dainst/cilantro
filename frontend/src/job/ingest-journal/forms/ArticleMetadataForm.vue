<template>
    <section>
        <b-field grouped group-multiline>
            <b-field label="ojs_journal_code">
                <b-input v-model="article.ojs_journal_code"></b-input>
            </b-field>
            <b-field label="ojs_user">
                <b-input v-model="article.ojs_user"></b-input>
            </b-field>
            <b-field label="auto_publish_issue">
                <b-switch v-model="article.auto_publish_issue"></b-switch>
            </b-field>
            <b-field label="default_publish_articles">
                <b-switch v-model="article.default_publish_articles"></b-switch>
            </b-field>
            <b-field label="default_create_frontpage">
                <b-input v-model="article.default_create_frontpage"></b-input>
            </b-field>
            <b-field label="allow_upload_without_file">
                <b-input v-model="article.allow_upload_without_file"></b-input>
            </b-field>
        </b-field>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ArticleMetadataForm extends Vue {
    @Prop() private initialArticle!: Object

    data() {
        return {
            article: this.$props.initialArticle
        }
    }
}
</script>
