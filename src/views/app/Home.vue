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
import Hot from './Hot.vue';
import Footer from './layout/Footer.vue';

const route = useRoute();
const router = useRouter();

// 搜索
const inputSearchValue = ref("");
const onSearch = (value: string) => {
    inputSearchValue.value = value;
    handleItemClick({ searchText: value }, '/app', router, false)
}

// 数据源
const apiURL = `${SystemConfig.host}/api/app/blogs/query`;
const dataSourceHot = ref([]);
const handleGetListHot = () => {
    let requestParams = Object.assign({}, {
        size: 10,
        index: 1,
        total: 0
    });
    Object.assign(requestParams, {
        searchText: isValidValue(inputSearchValue.value) ? inputSearchValue.value : null,
        classId: isValidValue(inputSearchValue.value) ? null : (isValidValue(route.query.classId) ? route.query.classId : null)
    });
    request({
        url: `${apiURL}/getBlogClassHot`,
        params: requestParams
    }).then((data: any) => {
        if(!(data instanceof Object) || !(data.result instanceof Array)){
            return;
        }
        const result = data.result;
        const value = dataSourceHot.value;
        value.splice(0, value.length);
        result.forEach((element: any, index: number) => {
            if (index === 0) {
                element.color = "pink";
            } else if (index === 1) {
                element.color = "orange";
            } else if (index === 2) {
                element.color = "green";
            } else {
                element.color = "default";
            }
            // @ts-ignore
            element = handleDecodemultiple(element, element.key, ["title"]);
            // @ts-ignore
            value.push(element);
        });
    }).catch((err: any) => {
        console.log(err);
    });
};

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
        handleGetListHot();
        handleGetListNav();
    });
});

// 监听路由变化，重新获取所有数据
watch(route, (to, from) => {
    handleGetListHot();
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
    background-color: #fdfcf8;
    color: #999;
    overflow-y: scroll;
    overflow-x: auto;
}

.x-container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    /* outline: 1px solid red; */
}

/* PC 设备（宽度大于 992px）使用 1200px 固定宽度 */
@media (min-width: 1200px) {
    .x-container {
        width: 1200px;
    }
}

.x-container.flex-auto {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.x-container.flex-auto :deep(.app-content) {
    flex: 1;
}

.app-header {
    padding: 20px 0;
}

.layout-nav {
    background-color: #e8e7e3;
    color: #999;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.layout-footer {
    background-color: #e8e7e3;
    color: #999;
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
    /* 整体布局优化 */
    .app-win {
        font-size: 14px;
        overflow-x: hidden;
    }

    /* 隐藏 PC 端顶部 Header */
    .app-header {
        display: none;
    }

    /* 移动端顶部导航栏 */
    .mobile-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background-color: #e8e7e3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .mobile-header .logo {
        font-size: 20px;
        font-weight: bold;
        color: #FF5722;
    }

    .mobile-header .search-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #333;
        padding: 5px;
    }

    /* 移动端导航栏 */
    .layout-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        max-height: calc(100vh - 50px - 60px);
        overflow-y: auto;
        background-color: #e8e7e3;
        z-index: 999;
    }

    .app-nav {
        display: flex;
        flex-direction: column;
        padding: 10px 0;
    }

    .app-nav::before,
    .app-nav::after {
        display: none;
    }

    .app-nav .li {
        padding: 15px 20px;
        font-size: 16px;
        border-bottom: 1px solid #ddd;
    }

    .app-nav .li::after {
        display: none;
    }

    .app-nav .li:last-child {
        border-bottom: none;
    }

    /* 内容区域调整 */
    .x-container.flex-auto {
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .layout-content {
        flex-direction: column;
        padding: 10px;
    }

    .c-layout.layout-right {
        order: 2;
        width: 100%;
        max-width: 100%;
        margin-top: 15px;
        padding: 0 10px;
    }

    .c-layout.layout-left {
        order: 1;
        width: 100%;
        padding: 0;
    }

    /* 热门排行卡片 */
    .app-unit {
        margin-bottom: 15px;
    }

    .app-unit .unit-title {
        padding: 0 10px;
        font-size: 15px;
    }

    .app-unit .unit-content {
        padding: 10px;
    }

    .app-unit .unit-content > ul > li {
        line-height: 28px;
        font-size: 14px;
    }

    /* 页脚调整 */
    .layout-footer {
        padding: 20px 10px;
        text-align: center;
        font-size: 12px;
    }

    /* 底部固定导航（可选） */
    .mobile-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        z-index: 998;
    }

    .mobile-bottom-nav .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
        padding: 5px;
    }

    .mobile-bottom-nav .nav-item i {
        font-size: 20px;
        margin-bottom: 3px;
    }

    .mobile-bottom-nav .nav-item.active {
        color: #FF5722;
    }
}
</style>
