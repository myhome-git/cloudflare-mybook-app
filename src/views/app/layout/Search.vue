<template>
    <div id="form-search" class="x-head-search x-clearfix">
        <input type="text" placeholder="请输入搜索内容..." v-model="inputSearchValue" @keyup.enter="handleClick">
        <div id="btn-search" class="x-search-btn x-inlineblock" @click="handleClick">
            <SearchOutlined />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(["onSearch"]);

const inputSearchValue = ref<string>('');
const handleClick = () => {
    // console.log(inputSearchValue.value);
    emit('onSearch', inputSearchValue.value);
}
</script>
<style scoped>
.x-head-search {
    max-width: 400px;
    flex: 1;
    border-radius: 20px;
    position: relative;
    margin: auto;
    transition: all 0.3s ease-in-out 0s;
    margin: 0px 20px;
    background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
    border-width: 1px;
    border-style: solid;
    border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.2);*/
}

.x-head-search:before {
    display: block;
    content: "";
    height: 100%;
    position: absolute;
    right: 60px;
    top: 0;
    border-left: inherit;
}

.x-head-search input {
    height: 36px;
    border: 0;
    border-radius: 20px 0px 0px 20px;
    width: calc(100% - 62px);
    padding-left: 15px;
    background-color: transparent;
}
.x-head-search input:focus {
  outline: none;
  /* 使用阴影模拟外发光效果，不会引起布局抖动 */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); 
}

.x-head-search .x-search-btn {
    width: 46px;
    text-align: center;
    cursor: pointer;
    float: right;
    margin-right: 13px;
    margin-top: 3px;
    position: relative;
}

.x-head-search .x-search-btn .anticon-search {
    font-size: 24px;
    font-weight: 700;
    position: absolute;
    left: 10px;
    top: 0px;
    padding: 3px 10px;
}

.x-head-search.action-focus,
.x-head-search:hover {
    border-width: 1px;
    border-style: solid;
    border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
</style>
