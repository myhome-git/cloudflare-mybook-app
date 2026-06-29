<template>
    <div class="app-content">
        <div class="c-layout layout-left">
            <slot name="left">
                left
            </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
</script>

<style scoped>
.app-content {
    padding: 26px 0;
    display: grid;
    gap: 26px;
    align-items: start;
}

.c-layout {}

.layout-left {
    /* 左侧自适应，最小宽度 500px */
    position: relative;
    height: 100%;
}
.layout-left::after{
    content: '';
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    border: 1px solid #eee;
    border-radius: 5px;
}

.layout-right {
    /* 右侧固定宽度 400px */
    position: relative;
}
.layout-right::after{
    content: '';
    display: block;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    border: 0px solid red;
    border-radius: 5px;
}

/* 平板设备响应式样式 (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
    .app-content {
        padding: 20px;
        gap: 20px;
    }

    .layout-right {
        order: 2;
        width: 35%;
        max-width: 400px;
    }

    .layout-left {
        order: 1;
        width: 100%;
    }
}

/* 手机设备响应式样式 (< 768px) */
@media (max-width: 767px) {
    .app-content {
        padding: 10px;
        gap: 15px;
    }

    .layout-right {
        order: 2;
        width: 100%;
        max-width: 100%;
        margin-top: 10px;
    }

    .layout-left {
        order: 1;
        width: 100%;
    }

    /* 隐藏右侧装饰边框 */
    .layout-right::after {
        display: none;
    }
}

/* 小屏手机响应式样式 (< 480px) */
@media (max-width: 479px) {
    .app-content {
        padding: 5px;
        gap: 10px;
    }

    .layout-left::after {
        border-radius: 3px;
    }
}
</style>
