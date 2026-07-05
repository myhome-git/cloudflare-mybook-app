<template>
    <div class="app-header">
        <Logo></Logo>
        <Search @onSearch="onSearch"></Search>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import Logo from './Logo.vue';
import Search from './Search.vue';
import HeaderLogin from './HeaderLogin.vue';

const emit = defineEmits(["onSearch"]);
const onSearch = (value: string) => {
    emit('onSearch', value);
}
</script>
<style scoped>
.app-header {
    /**左右排列 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0px;
    gap: 16px;
}
@media screen and (max-width: 767px) {
    .app-header {
        padding: 10px 0px;
    }
}
</style>
