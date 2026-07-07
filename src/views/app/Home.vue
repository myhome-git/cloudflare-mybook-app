<template>
    <div class="app-win">
        <link rel="stylesheet" href="//at.alicdn.com/t/font_1281105_ue0q9rvh0lb.css">
            <div class="x-container">
                <Header @onSearch="onSearch"></Header>
            </div>
            <div class="x-layout layout-nav">
                <div class="x-container">
                    <Nav :dataSource="dataSourceNav"></Nav>
                </div>
            </div>
            <div class="x-container flex-auto">
                <div class="layout-content">
                    <Content>
                        <template #left>
                            <RouterView></RouterView>
                        </template>
                        <template #right></template>
                    </Content>
                </div>
            </div>
            <div class="x-layout layout-footer">
                <div class="x-container">
                    <Footer></Footer>
                </div>
            </div>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import SystemConfig from "@/SystemConfig.js";
import { RouterLink, RouterView } from 'vue-router';
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isValidValue, handleDecodemultiple, handleItemClick } from "@/utils/utils.js";
// @ts-ignore
import request from "@/utils/request.js";
import './assets/css/common.css';
import Header from './layout/Header.vue';
import Nav from './layout/Nav.vue';
import Content from './layout/Content.vue';
import Footer from './layout/Footer.vue';
const route = useRoute();
const router = useRouter();

// 分页
const pagination = ref({
    size: 50,
    index: 1,
    total: 0
});

// 搜索
const inputSearchValue = ref("");
const onSearch = (value: string) => {
    inputSearchValue.value = value;
    handleItemClick({ searchText: value, ...pagination.value }, '/app', router, false)
}

const dataSourceNav = ref([]);
const handleGetListNav = () => {
    let requestParams = Object.assign({}, {
        size: 10,
        index: 1,
        total: 0
    });
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null
    });
    request({
        url: `${SystemConfig.host}/api/app/blogClass`,
        params: requestParams
    }).then((data: any) => {
        const result = data.result;
        if(!(result instanceof Array)){
            return;
        }
        const value = dataSourceNav.value;
        value.splice(0, value.length);
        result.forEach((element: any) => {
            // @ts-ignore
            value.push(element);
        });
    }).catch((err: any) => {
        console.log(err);
    });
};

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        handleGetListNav();
    });
});

// 监听路由变化，重新获取所有数据
watch(route, (to, from) => {
    // console.log('Route changed:', to.fullPath);
});
</script>
<style scoped>
/* 这里可以添加样式，或者在全局样式中定义 */
.app-win {
    font-family: "Microsoft YaHei", "Helvetica Neue", "Hiragino Sans GB", "黑体", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: auto;
    --appwin--bg-color-rgb: 253, 252, 248;
    --appwin--bg-color-opacity: 0.3;
    --appwin--border-color-rgb: 0, 0, 0;
    --appwin--border-color-opacity: 0.2;
}

.x-container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    /* outline: 1px solid red; */
}

.x-container.flex-auto {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.x-container.flex-auto :deep(.app-content) {
    flex: 1;
}

.layout-nav {
    background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.layout-footer {
    background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
}

.layout-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* 路由切换过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
/* ==================== 
手机设备响应式样式 (< 768px)
==================== */
@media (max-width: 767px) {
  /* 顶部导航优化 */
  .x-container {
    width: 100%;
  }
}
</style>
<style>
body .app-win{
  color: #999;
}
body .layout-nav{
  color: #666;
}
body.default .app-win{
  background-color: #fdfcf8;
}
body.green .app-win{
  background-color: #cddfcd;
}
body.blue .app-win{
  background-color: #cfdde1;
}
body.pink .app-win{
  background-color: #ebcece;
}
body.gray .app-win{
  background-color: #d0d0d0;
}
body.sepia .app-win{
  background-color: #ede7da;
}
body.dark .app-win{
  background-color: #1a1a1a;
}

body.green .app-win, body.blue .app-win, body.pink .app-win, body.gray .app-win, body.sepia .app-win{
  color: #333;
}

/*默认模式*/
body.default .layout-nav{
  background-color: #e8e7e3;
}
body.default .layout-footer{
  background-color: #e8e7e3;
}

/**夜间模式样式，覆盖阅读器内容区域的背景色和文字颜色*/
body.dark .app-win{
  color: #d4d4d4;
}
body.dark .layout-nav{
  color: #ddd;
}
body.dark .layout-footer{
  background-color: #1a1a1a;
}
body.dark .reading-area{
  background-color: #1a1a1a;
  border: 1px solid #333;
}
body.dark .chapter-content{
  color: #646161;
}
body.dark .chapter-nav-btn{
  background-color: #1a1a1a;
  color: #646161;
  border: 1px solid #333;
}

</style>
