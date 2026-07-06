<template>
    <div class="app-nav">
        <div class="li" :class="{ active: route.query.classId === 'home' }" @click="router.push({ path: '/app/books/index', query: { index: '1', classId: 'home' } })">
            首页
        </div>
        <template v-if="computedDataSource.length > 0">
            <template v-for="(item, index) of computedDataSource" :key="item.id">
                <li class="li" :class="{ active: route.query.classId === `${item.id}` }"
                    @click="router.push({ path: '/app/books/list', query: { index: '1', classId: item.id } })">
                    <span>{{ item.name }}</span>
                </li>
            </template>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, useAttrs } from 'vue';
import { handleItemClick } from '@/utils/utils';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 处理列表项点击事件
const handleItemClickWrapper = (obj: any, url: string) => {
    handleItemClick(obj, url, router, false, false);
};

// 透传对象属性和方法
const attrs = useAttrs();
const { dataSource, onPageChange } = attrs as {
    dataSource?: any[] | { value: any[] },
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    }
};
// 计算属性，用于处理 dataSource
const computedDataSource = computed(() => {
    if (Array.isArray(dataSource)) {
        return dataSource;
    } else if (dataSource && dataSource.value && Array.isArray(dataSource.value)) {
        return dataSource.value;
    }
    return [];
});
</script>
<style>
.app-nav {
    line-height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    position: relative;
}

.app-nav .li {
    padding: 0px 20px 0px 20px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    position: relative;
}
.app-nav::before {
    display: block;
    content: '';
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: #ddd;
}
.app-nav::after {
    display: block;
    content: '';
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: #ddd;
}
.app-nav .li::after {
    display: block;
    content: '';
    transition: all 0.3s;
    position: absolute;
    top: 18px;
    right: -1px;
    height: 16px;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: #ddd;
}

.app-nav .li:first-child::before {
    display: none;
}

.app-nav .li:last-child::after {
    display: none;
}

.app-nav .li.active {
    color: #fff;
    background-color: #3f3f3f
}

.app-nav .li:hover {
    color: #fff;
    background-color: rgba(63, 63, 63, 0.7);
}

/* 小说链接特殊样式 */
.app-nav .novel-link {
    font-size: 18px;
    font-weight: bold;
    color: #ff6b6b;
}

.app-nav .novel-link i {
    margin-right: 4px;
}

.app-nav .novel-link:hover {
    color: #ff5252;
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {
    .app-nav {
        display: flex;
        flex-direction: column;
        line-height: normal;
    }

    .app-nav::before,
    .app-nav::after {
        display: none;
    }

    .app-nav .li {
        padding: 15px 20px;
        font-size: 16px;
        text-align: left;
    }

    .app-nav .li:last-child {
        border-bottom: none;
    }

    .app-nav .li::after {
        display: none;
    }

    /* 移动端导航项悬停效果 */
    .app-nav .li:hover {
        background-color: rgba(63, 63, 63, 0.5);
    }
}
</style>
<style>
body.dark .app-nav::before {
    display: block;
    content: '';
    border-left-color: #999;
}
body.dark .app-nav::after {
    display: block;
    content: '';
    border-right-color: #999;
}
body.dark .app-nav .li::before {
    display: block;
    content: '';
    border-left-color: inherit;
}
</style>
