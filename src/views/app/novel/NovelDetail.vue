<template>
  <div class="novel-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <i class="iconfont icon-loading rotate360"></i>
      <p>加载中...</p>
    </div>

    <!-- 小说详情内容 -->
    <template v-else-if="novelData">
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
                {{ novelData.chapterCount || 0 }}章
              </span>
              <span class="stat-item">
                <i class="iconfont icon-eye"></i>
                {{ novelData.readCount || 0 }}阅读
              </span>
              <span class="stat-item">
                <i class="iconfont icon-clock"></i>
                更新于{{ novelData.updateTime }}
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
          <a-input-search
            v-model:value="searchChapter"
            placeholder="搜索章节..."
            allow-clear
            style="width: 250px;"
            @search="filterChapters"
          >
            <template #prefix>
              <i class="iconfont icon-search"></i>
            </template>
          </a-input-search>
        </div>
        
        <!-- 目录列表 - 响应式 -->
        <div class="catalog-grid">
          <div 
            v-for="chapter in filteredChapters" 
            :key="chapter.id"
            :class="['chapter-item', { active: currentChapterId === chapter.id }]"
            @click="goToChapter(chapter.id)"
          >
            {{ chapter.name }}
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalChapters > pageSize" class="catalog-pagination">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="totalChapters"
            show-size-changer
            @change="handlePageChange"
          />
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <i class="iconfont icon-empty"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mockNovels, mockChapters, getNovelDetail, getChapters } from './mock-data';

const router = useRouter();
const route = useRoute();

// 数据状态
const novelData = ref<any>(null);
const chapters = ref<any[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalChapters = ref(0);
const searchChapter = ref('');
const currentChapterId = ref<string>('c1');

// 过滤后的章节列表
const filteredChapters = computed(() => {
  if (!searchChapter.value) {
    return chapters.value;
  }
  return chapters.value.filter((chapter: any) => {
    const name = chapter.name || chapter.title || '';
    return name.includes(searchChapter.value);
  });
});

// 获取小说详情
const fetchNovelDetail = async () => {
  loading.value = true;
  try {
    // 使用模拟数据
    const id = route.params.id as string;
    const detail = getNovelDetail(id);
    
    if (detail) {
      novelData.value = detail;
      currentChapterId.value = 'c1';
      
      // 获取该小说的章节
      const novelChapters = getChapters(id);
      if (novelChapters.length === 0) {
        // 如果没有对应小说的章节，生成一些示例章节
        chapters.value = [
          { id: 'c1', name: '第一章 秦羽' },
          { id: 'c2', name: '第二章 神秘石碑' },
          { id: 'c3', name: '第三章 奇遇' },
          { id: 'c4', name: '第四章 修炼之路' },
          { id: 'c5', name: '第五章 家族试炼' }
        ];
      } else {
        chapters.value = novelChapters.map((c: any, index: number) => ({
          id: `c${index + 1}`,
          name: c.name
        }));
      }
      totalChapters.value = chapters.value.length;
    }
  } catch (error) {
    console.error('获取小说详情失败:', error);
  } finally {
    loading.value = false;
  }
};

// 筛选章节
const filterChapters = () => {
  currentPage.value = 1;
};

// 分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
};

// 开始阅读
const startReading = () => {
  if (chapters.value.length > 0) {
    goToChapter(chapters.value[0].id);
  }
};

// 跳转到章节
const goToChapter = (chapterId: string) => {
  router.push(`/app/read/${chapterId}`);
};

onMounted(() => {
  fetchNovelDetail();
});

watch(() => route.params.id, () => {
  fetchNovelDetail();
});
</script>

<style scoped>
.novel-detail-container {
  background: #fdfcf8;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
}

.loading-state .iconfont {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 头部信息 */
.detail-header {
  background: linear-gradient(135deg, #e8e7e3 0%, #f5f5f5 100%);
  padding: 40px 20px;
  border-bottom: 1px solid #ddd;
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
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.novel-author-large {
  font-size: 16px;
  color: #999;
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
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .iconfont {
  font-size: 22px;
  color: #3f3f3f;
}

/* 章节目录网格 */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chapter-item {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-item:hover {
  background: #e8e7e3;
  color: #333;
}

.chapter-item.active {
  background: #3f3f3f;
  color: #fff;
}

/* 目录分页 */
.catalog-pagination {
  margin-top: 20px;
  text-align: center;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
}

.empty-state .iconfont {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
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

  .catalog-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

  .catalog-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    max-height: 400px;
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

  .catalog-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {
  /* 整体容器 */
  .novel-detail-container {
    background: #fdfcf8;
  }

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

  /* 章节目录网格优化 */
  .catalog-grid {
    display: flex;
    flex-direction: column;
    grid-template-columns: 1fr;
    max-height: 400px;
    gap: 8px;
  }

  .chapter-item {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 4px;
  }

  /* 目录分页优化 */
  .catalog-pagination {
    margin-top: 16px;
  }

  .custom-pagination :deep(.ant-pagination) {
    font-size: 12px;
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

/* ==================== 
   小屏手机响应式样式 (< 480px)
   ==================== */
@media (max-width: 479px) {
  /* 头部信息优化 */
  .detail-header {
    padding: 16px 12px;
  }

  .novel-cover-large {
    width: 100px;
    height: 140px;
  }

  .novel-title-large {
    font-size: 18px;
  }

  .novel-author-large {
    font-size: 13px;
  }

  .novel-stats {
    gap: 8px;
  }

  .stat-item {
    font-size: 11px;
  }

  .novel-desc-large {
    font-size: 12px;
  }

  /* 操作按钮优化 */
  .action-buttons {
    gap: 8px;
  }

  .action-buttons :deep(.ant-btn) {
    padding: 8px 16px;
    font-size: 13px;
  }

  /* 目录区域优化 */
  .catalog-section {
    padding: 16px 12px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-title .iconfont {
    font-size: 18px;
  }

  /* 章节目录网格优化 */
  .catalog-grid {
    max-height: 350px;
  }

  .chapter-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  /* 空状态优化 */
  .empty-state {
    height: 250px;
  }

  .empty-state .iconfont {
    font-size: 40px;
  }

  .empty-state p {
    font-size: 13px;
  }
}
</style>