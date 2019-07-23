import { mount, createLocalVue } from '@vue/test-utils'
import Buefy from 'buefy'
import JournalMetadataForm from '@/job/ingest-journal/forms/JournalMetadataForm.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

describe('JournalMetadataForm.vue', () => {
    const wrapper = mount(JournalMetadataForm, {
        localVue
    })

    it('renders input element', () => {
        const el = wrapper.find('input')
        expect(el.is('input')).toBe(true)
    })
})
