<template>
    <div>
        <Authentication />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Authentication from '../authentication/Authentication.vue';

@Component({
    components: {
        Authentication
    }
})
export default class MainMenu extends Vue { }
</script>
