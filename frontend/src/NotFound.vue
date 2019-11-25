<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-size-1">404</div>
        </div>
        <div class="columns is-centered">
            <div class="column is-size-4">Requested page does not exist.</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class NotFound extends Vue {
}
</script>
