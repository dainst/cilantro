import { shallowMount, createLocalVue } from '@vue/test-utils'
import Buefy from 'buefy'
import ArticleMetadataForm from '@/components/forms/ArticleMetadataForm.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('ArticleMetadataForm.vue', () => {
    const article = {
        ojs_journal_code: 'test_code',
        ojs_user: '',
        auto_publish_issue: false,
        default_publish_articles: true,
        default_create_frontpage: '',
        allow_upload_without_file: ''
    }
    const wrapper = shallowMount(ArticleMetadataForm, {
        localVue,
        propsData: { initialArticle: article }
    })

    it('renders input element', () => {
        expect(wrapper.contains('input')).toBe(true)
    })
})
