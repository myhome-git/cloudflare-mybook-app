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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
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

// 主题设置
const readerSettings = ref({
  theme: 'default',
  fontSize: `${localStorage.getItem('readerFontSize') || '18px'}`,
  show: false
});
// 监听主题设置变化
watch(() => readerSettings.value.theme, (newValue) => {
  document.body.className = newValue;
  localStorage.setItem('readerTheme', newValue);
});

// 监听路由变化，重新获取所有数据
watch(route, (to, from) => {
    // console.log('Route changed:', to.fullPath);
});

// 监听window.parent.postMessage消息
const messageEventListener = (event: MessageEvent) => {
  if (event.data.type === 'themeChange') {
    readerSettings.value.theme = event.data.theme;
    } else if (event.data.type === 'fontSizeChange') {
    readerSettings.value.fontSize = event.data.fontSize;
  }
};

// 挂载事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {
        if(localStorage.getItem('readerTheme')){
            readerSettings.value.theme = `${localStorage.getItem('readerTheme')}`;
        }
        handleGetListNav();

        // 监听window.parent.postMessage消息
        window.addEventListener('message', messageEventListener);
    });
});
onUnmounted(() => {
  window.removeEventListener('message', messageEventListener);
});
</script>
<style scoped>
/* 这里可以添加样式，或者在全局样式中定义 */
.app-win {
    font-family: "Microsoft YaHei", "Helvetica Neue", "Hiragino Sans GB", "黑体", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: auto;
    --appwin--bg-color-opacity-hover: 0.2;
    --appwin--border-color-opacity: 1;
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
    background-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity) + 0.2));
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
body.default .app-win{
  background-color: #cddfcd;
  --appwin--bg-color-opacity-hover: 0.5;
  --appwin--border-color-opacity: 0.5;
  --appwin--bg-color-rgb: 129, 169, 129;
  --appwin--bg-color-rgb-hover: 22, 78, 22;
  --appwin--border-color-rgb: 129, 169, 129;
  --appwin--color-hover: #ffffff;
}
body.green .app-win{
  background-color: #cddfcd;
  --appwin--bg-color-rgb: 129, 169, 129;
  --appwin--bg-color-rgb-hover: 22, 78, 22;
  --appwin--border-color-rgb: 129, 169, 129;
  --appwin--color-hover: #ffffff;
}
body.blue .app-win{
  background-color: #cfdde1;
  --appwin--bg-color-rgb: 151, 180, 189;
  --appwin--bg-color-rgb-hover: 16, 66, 82;
  --appwin--border-color-rgb: 151, 180, 189;
  --appwin--color-hover: #ffffff;
}
body.pink .app-win{
  background-color: #ebcece;
  --appwin--bg-color-rgb: 193, 153, 153;
  --appwin--bg-color-rgb-hover: 116, 59, 59;
  --appwin--border-color-rgb: 193, 153, 153;
  --appwin--color-hover: #ffffff;
}
body.Ivory .app-win{
  background-color: #fdfcf8;
  --appwin--bg-color-rgb: 232, 231, 227;
  --appwin--bg-color-rgb-hover: 0, 0, 0;
  --appwin--border-color-rgb: 200, 200, 200;
  --appwin--color-hover: #333;
}
body.gray .app-win{
  background-color: #d0d0d0;
  --appwin--bg-color-rgb: 151, 151, 151;
  --appwin--bg-color-rgb-hover: 61, 61, 61;
  --appwin--border-color-rgb: 151, 151, 151;
  --appwin--color-hover: #ffffff;
}
body.sepia .app-win{
  background-color: #ede7da;
  --appwin--bg-color-rgb: 185, 172, 145;
  --appwin--bg-color-rgb-hover: 70, 57, 31;
  --appwin--border-color-rgb: 185, 172, 145;
  --appwin--color-hover: #ffffff;
}
body.dark .app-win{
  color: #cddfcd;
  background-color: #1a1a1a;
  --appwin--bg-color-rgb: 255, 255, 255;
  --appwin--bg-color-opacity: 0.1;
  --appwin--bg-color-rgb-hover: 255, 255, 255;
  --appwin--bg-color-opacity-hover: 0.5;
  --appwin--border-color-rgb: 255, 255, 255;
  --appwin--border-color-opacity: 0.1;
  --appwin--color-hover: #333;
}

body.default, body.green, body.blue, body.pink, body.Ivory, body.gray, body.sepia{
  color: #333;
  --appwin--bg-color-rgb: 253, 252, 248;
  --appwin--bg-color-opacity: 0.2;
  --appwin--border-color-rgb: 204, 204, 204;
  --appwin--border-color-opacity: 0.35;
}
body.green, body.blue, body.pink, body.gray, body.sepia{
  --appwin--bg-color-rgb-hover: 255, 255, 255;
  --appwin--bg-color-opacity-hover: 0.5;
}

/*默认模式*/
body.Ivory .layout-nav{
  background-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity) + 0.75));
}
body.Ivory .layout-footer{
  background-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity) + 0.5));
}

/**夜间模式样式，覆盖阅读器内容区域的背景色和文字颜色 */
body.dark .app-win{
  color: #d4d4d4;
}
body.dark .layout-nav{
  background-color: rgba(var(--appwin--bg-color-rgb), 0.05);
  color: #777;
}
body.dark .layout-footer{
  background-color: rgba(var(--appwin--bg-color-rgb), 0.05);
  color: #666;
}
body.dark .reading-area{
  background-color: rgba(var(--appwin--bg-color-rgb), 0);
  border: 1px solid #333;
}
body.dark .chapter-info{
  color: #646161;
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
