<template>
    <div>
        <Authentification />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Authentification from "./Authentification.vue";

@Component({
    components: {
        Authentification
    }
})
export default class MainMenu extends Vue {}
</script>
