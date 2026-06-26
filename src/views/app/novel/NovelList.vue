<template>
  <div class="novel-list-container">

    <!-- 分类导航 - 响应式 -->
    <div class="category-nav">
      <div 
        v-for="item in novelCategories" 
        :key="item.id"
        :class="['category-item', { active: currentCategory === item.id }]"
        @click="selectCategory(item.id)"
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 小说列表 - 响应式网格布局 -->
    <div class="novel-grid">
      <div 
        v-for="novel in filteredNovels" 
        :key="novel.id"
        class="novel-card"
        @click="goToDetail(novel.id)"
      >
        <div class="novel-cover">
          <img :src="novel.cover || '/default-cover.jpg'" alt="封面" />
          <div class="novel-tag" v-if="novel.isHot">热门</div>
        </div>
        <div class="novel-info">
          <h3 class="novel-title">{{ novel.title }}</h3>
          <p class="novel-author">作者：{{ novel.author || '未知' }}</p>
          <p class="novel-desc">{{ novel.description || '暂无简介' }}</p>
          <div class="novel-meta">
            <span class="novel-chapters">共{{ novel.chapterCount || 0 }}章</span>
            <span class="novel-update">更新于{{ novel.updateTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        show-size-changer
        show-quick-jumper
        :show-total="(current, total) => `共 ${total} 条`"
        @change="handlePageChange"
        class="custom-pagination"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredNovels.length === 0 && !loading" class="empty-state">
      <i class="iconfont icon-empty"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mockCategories, mockNovels } from './mock-data';

const router = useRouter();
const route = useRoute();

// 数据状态
const novels = ref<any[]>([...mockNovels]);
const novelCategories = ref<any[]>([...mockCategories]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(8);
const total = ref(mockNovels.length);
const searchText = ref('');
const currentCategory = ref<string | undefined>(undefined);

// 过滤后的小说列表
const filteredNovels = computed(() => {
  let result = [...novels.value];
  
  // 按分类过滤
  if (currentCategory.value) {
    result = result.filter((n: any) => n.classId === currentCategory.value);
  }
  
  // 按搜索词过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter((n: any) => 
      n.title.toLowerCase().includes(keyword) ||
      n.author.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
  currentCategory.value = undefined;
};

// 选择分类
const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId === currentCategory.value ? undefined : categoryId;
  currentPage.value = 1;
};

// 分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
};

// 跳转到详情页
const goToDetail = (id: string) => {
  router.push(`/app/novel/${id}`);
};

onMounted(() => {
  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.novel-list-container {
  margin: 0 auto;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 24px;
  text-align: center;
}

.search-bar :deep(.ant-input-search) {
  border-radius: 25px;
}

/* 分类导航 - 响应式 */
.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.category-item {
  padding: 8px 20px;
  background: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.category-item:hover {
  background: #e8e7e3;
  color: #333;
}

.category-item.active {
  background: #3f3f3f;
  color: #fff;
}

/* 小说网格 - 响应式 */
.novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.novel-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.novel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.novel-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.novel-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.novel-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.novel-info {
  padding: 16px;
}

.novel-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.novel-author {
  font-size: 13px;
  color: #999;
  margin: 0 0 8px 0;
}

.novel-desc {
  font-size: 13px;
  color: #777;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.novel-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #bbb;
}

/* 分页 */
.pagination-container {
  text-align: center;
  padding: 24px 0;
}

.custom-pagination :deep(.ant-pagination) {
  justify-content: center;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state .iconfont {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  font-size: 16px;
}

/* 响应式设计 - 平板 */
@media (max-width: 1024px) {
  .novel-list-container {
    padding: 16px;
  }

  .novel-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .novel-cover {
    height: 160px;
  }
}

/* 响应式设计 - 手机 */
@media (max-width: 768px) {
  .novel-list-container {
    padding: 12px;
  }

  .search-bar {
    margin-bottom: 16px;
  }

  .search-bar :deep(.ant-input-search) {
    width: 100%;
  }

  .category-nav {
    gap: 8px;
    padding: 12px;
  }

  .category-item {
    padding: 6px 16px;
    font-size: 13px;
  }

  .novel-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .novel-cover {
    height: 200px;
  }

  .novel-title {
    font-size: 15px;
  }

  .novel-author,
  .novel-desc {
    font-size: 12px;
  }
}

/* ==================== 
   平板设备响应式样式 (768px - 991px)
   ==================== */
@media (max-width: 991px) and (min-width: 768px) {
  .novel-list-container {
    padding: 16px;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .category-nav {
    gap: 10px;
    padding: 14px;
  }

  .category-item {
    padding: 7px 16px;
    font-size: 13px;
  }

  .novel-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .novel-cover {
    height: 160px;
  }

  .novel-title {
    font-size: 15px;
  }
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {
  .novel-list-container {
    padding: 12px;
    max-width: 100%;
  }

  /* 搜索栏优化 */
  .search-bar {
    margin-bottom: 16px;
  }

  .search-bar :deep(.ant-input-search) {
    width: 100% !important;
    max-width: 100%;
  }

  /* 分类导航优化 */
  .category-nav {
    gap: 8px;
    padding: 12px;
    max-height: 100px;
    overflow-y: auto;
  }

  .category-item {
    padding: 6px 14px;
    font-size: 13px;
    border-radius: 16px;
  }

  /* 小说卡片列表优化 */
  .novel-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .novel-card {
    display: flex;
    flex-direction: row;
    padding: 0;
  }

  .novel-cover {
    width: 120px;
    height: 160px;
    flex-shrink: 0;
  }

  .novel-tag {
    top: 8px;
    right: 8px;
    padding: 3px 10px;
    font-size: 11px;
  }

  .novel-info {
    padding: 12px;
    flex: 1;
  }

  .novel-title {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .novel-author {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .novel-desc {
    font-size: 12px;
    margin-bottom: 10px;
    -webkit-line-clamp: 2;
  }

  .novel-meta {
    font-size: 11px;
  }

  /* 分页优化 */
  .pagination-container {
    padding: 16px 0;
  }

  .custom-pagination :deep(.ant-pagination) {
    font-size: 13px;
  }

  .custom-pagination :deep(.ant-pagination-item) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }

  /* 空状态优化 */
  .empty-state {
    padding: 40px 20px;
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
  .novel-list-container {
    padding: 8px;
  }

  .search-bar {
    margin-bottom: 12px;
  }

  .category-nav {
    gap: 6px;
    padding: 10px;
  }

  .category-item {
    padding: 5px 12px;
    font-size: 12px;
  }

  .novel-cover {
    width: 100px;
    height: 140px;
  }

  .novel-info {
    padding: 10px;
  }

  .novel-title {
    font-size: 14px;
  }

  .novel-author,
  .novel-desc {
    font-size: 11px;
  }

  .novel-meta {
    font-size: 10px;
  }

  /* 分页进一步优化 */
  .custom-pagination :deep(.ant-pagination) {
    font-size: 12px;
  }

  .custom-pagination :deep(.ant-pagination-item) {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
  }
}
</style>