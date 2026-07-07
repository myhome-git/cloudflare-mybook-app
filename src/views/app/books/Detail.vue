<template>
  <div class="novel-detail-container">
    <!-- 小说详情内容 -->
    <template v-if="novelData">
      <!-- 顶部信息栏 - 响应式 -->
      <div class="detail-header">
        <div class="header-content">
          <div class="novel-cover-large">
            <img :src="novelData.cover || '/default-cover.jpg'" alt="封面" />
          </div>
          <div class="novel-info-large">
            <h1 class="novel-title-large">{{ novelData.title }}</h1>
            <p class="novel-author-large">作者：{{ novelData.author || '未知' }}</p>
            <div class="novel-stats">
              <span class="stat-item">
                <i class="iconfont icon-chapter"></i>
                {{ novelData.total_chapters || 0 }}章
              </span>
              <span class="stat-item">
                <i class="iconfont icon-eye"></i>
                {{ novelData.read_count || 0 }}阅读
              </span>
              <span class="stat-item">
                <i class="iconfont icon-clock"></i>
                更新于{{ novelData.update_time }}
              </span>
            </div>
            <p class="novel-desc-large">{{ novelData.description || '暂无简介' }}</p>
            <div class="action-buttons">
              <a-button type="primary" size="large" @click="startReading">
                <i class="iconfont icon-book"></i>
                开始阅读
              </a-button>
              <a-button size="large">
                <i class="iconfont icon-star"></i>
                加入书架
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 目录区域 -->
      <div class="catalog-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="iconfont icon-list"></i>
            章节目录
          </h2>
        </div>
        
        <!-- 目录列表 - 响应式 -->
        <div class="catalog-grid">
          <div 
            v-for="chapter in chapters" 
            :key="chapter.id"
            :class="['chapter-item', { active: currentChapterId === chapter.id }]"
            @click="goToChapter(chapter.id)"
          >
            {{ chapter.title }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="no-data">
        <span>{{ isServerResult.message }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue, handleItemClick } from "@/utils/utils.js";

const router = useRouter();
const route = useRoute();

// 参数
const file_path = ref(``)
const folder = ref(``)
const folder_index = ref(``)

// 数据源
const apiURL = `/api/app/books/detail`;
const isServerResult = ref({
    status: 0,
    message: ''
});

const handleGetURL = () => {
  isServerResult.value.status = 0;
  isServerResult.value.message = 'Loading...';
  let sendParams = Object.assign({});
  request({
      url: `${apiURL}`,
      params: sendParams
  }).then((data: any) => {
      const result = data.result;
      const value = route.query;
      const folder = isValidValue(value.folder) ? String(value.folder) : '';
      const folderIndex = isValidValue(value.folder_index) ? String(value.folder_index) : '';
      handleGetBookChapters({url: result.url, folder: folder, folder_index: folderIndex});
  }).catch((err: any) => {
      isServerResult.value.status = 500;
      isServerResult.value.message = `Error：${err.message || err.data.message}`;
  });
};

const handleGetBookChapters = (options: { url: string; folder: string; folder_index: string }) => {
    const isServerResultValue = isServerResult.value;
    isServerResultValue.status = 0;
    isServerResultValue.message = 'Loading...';
    let sendParams = Object.assign({});
    request({
        url: [options.url, options.folder, options.folder_index].join('/'),
        params: sendParams
    }).then((data: any) => {
        isServerResultValue.status = 200;
        const result = data;
        novelData.value = result;
        (result.chapters || []).map((chapter: any) => {
            chapter.id = chapter.file;
            chapters.value.push(chapter)
            return chapter;
        });
        isServerResultValue.status = 200;
        isServerResultValue.message = 'Data loaded successfully';
    }).catch((err: any) => {
        isServerResultValue.status = 500;
        isServerResultValue.message = `Error：${err.message || err.data.message}`;
    });
};

// 数据状态
const novelData = ref<any>(null);
const chapters = ref<any[]>([]);
const currentChapterId = ref<string>('c1');

// 开始阅读
const startReading = () => {
  if (chapters.value.length > 0) {
    goToChapter(chapters.value[0].file);
  }
};

// 跳转到章节
const goToChapter = (id: string) => {
  handleItemClick({ file_path: file_path.value, folder: folder.value, folder_index: folder_index.value, id }, `/app/books/read`, router, false, false);
};

// 挂载事件
onMounted(async () => {
    await nextTick(() => {
        file_path.value = `${route.query.file_path}`;
        folder.value = `${route.query.folder}`;
        folder_index.value = `${route.query.folder_index}`;
        handleGetURL();
    });
});
</script>

<style scoped>
.novel-detail-container {
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
}

.no-data {
  padding: 20px;
}

/* 头部信息 */
.detail-header {
  background-color: rgba(var(--appwin--bg-color-rgb), 0);
  padding: 40px 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.novel-cover-large {
  width: 200px;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.novel-cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.novel-info-large {
  flex: 1;
  min-width: 0;
}

.novel-title-large {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.novel-author-large {
  font-size: 16px;
  margin: 0 0 16px 0;
}

.novel-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #777;
}

.stat-item .iconfont {
  font-size: 16px;
}

.novel-desc-large {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 目录区域 */
.catalog-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .iconfont {
  font-size: 22px;
  color: #3f3f3f;
}

/* 章节目录列表 */
.catalog-grid {
  background-color: transparent;
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); */
  /* padding: 8px; */
  overflow-y: auto;
}

.chapter-item {
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  border-width: 1px;
  border-style: solid;
  border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}

.chapter-item:hover {
  background: #e8e7e3;
  color: #333;
}

.chapter-item.active {
  background: #3f3f3f;
  color: #fff;
}

/* 响应式设计 - 平板 */
@media (max-width: 1024px) {
  .header-content {
    gap: 24px;
  }

  .novel-cover-large {
    width: 160px;
    height: 220px;
  }

  .novel-title-large {
    font-size: 24px;
  }
}

/* 响应式设计 - 手机 */
@media (max-width: 768px) {
  .detail-header {
    padding: 24px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .novel-cover-large {
    width: 140px;
    height: 196px;
  }

  .novel-title-large {
    font-size: 20px;
  }

  .novel-stats {
    justify-content: center;
  }

  .action-buttons {
    justify-content: center;
    width: 100%;
  }

  .action-buttons :deep(.ant-btn) {
    flex: 1;
    max-width: 200px;
  }

  .catalog-section {
    padding: 24px 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .section-header :deep(.ant-input-search) {
    width: 100%;
  }
}

/* ==================== 
   平板设备响应式样式 (768px - 991px)
   ==================== */
@media (max-width: 991px) and (min-width: 768px) {
  .detail-header {
    padding: 32px 20px;
  }

  .header-content {
    gap: 24px;
  }

  .novel-cover-large {
    width: 160px;
    height: 224px;
  }

  .novel-title-large {
    font-size: 24px;
  }

  .novel-info-large {
    min-width: 0;
  }

  .catalog-section {
    padding: 24px 20px;
  }
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {

  /* 加载状态优化 */
  .loading-state {
    height: 300px;
  }

  .loading-state .iconfont {
    font-size: 40px;
  }

  /* 头部信息优化 */
  .detail-header {
    padding: 20px 15px;
    border-bottom: none;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .novel-cover-large {
    width: 120px;
    height: 168px;
    border-radius: 6px;
  }

  .novel-info-large {
    width: 100%;
    min-width: 0;
  }

  .novel-title-large {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .novel-author-large {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .novel-stats {
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .stat-item {
    font-size: 12px;
    gap: 4px;
  }

  .stat-item .iconfont {
    font-size: 14px;
  }

  .novel-desc-large {
    font-size: 13px;
    margin-bottom: 15px;
    -webkit-line-clamp: 2;
  }

  /* 操作按钮优化 */
  .action-buttons {
    justify-content: center;
    width: 100%;
    gap: 10px;
  }

  .action-buttons :deep(.ant-btn) {
    flex: 1;
    max-width: 180px;
    padding: 10px 20px;
  }

  /* 目录区域优化 */
  .catalog-section {
    padding: 20px 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 18px;
    justify-content: center;
  }

  .section-title .iconfont {
    font-size: 20px;
  }

  .section-header :deep(.ant-input-search) {
    width: 100% !important;
  }

  /* 空状态优化 */
  .empty-state {
    height: 300px;
  }

  .empty-state .iconfont {
    font-size: 48px;
  }

  .empty-state p {
    font-size: 14px;
  }
}

</style>