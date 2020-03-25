import {shallowMount, createLocalVue} from '@vue/test-utils';
import Buefy from 'buefy';
import Vuex, {Store} from 'vuex'

import ContinueButton from '@/util/ContinueButton.vue'

const localVue = createLocalVue();
localVue.use(Buefy)
localVue.use(Vuex)

