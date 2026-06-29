<template>
  <div class="novel-list-container">
    <!-- 小说列表 - 响应式网格布局 -->
    <div class="novel-grid">
      <div 
        v-for="novel in props.dataSource" 
        :key="novel.id"
        class="novel-card"
        @click="handleItemClickDetail(novel.id)"
      >
        <div class="novel-cover">
          <img :src="novel.cover_url1 || '/default-cover.jpg'" alt="封面" />
          <div class="novel-tag" v-if="novel.isHot">热门</div>
        </div>
        <div class="novel-info">
          <h3 class="novel-title">{{ novel.title }}</h3>
          <p class="novel-author">作者：{{ novel.author || '未知' }}</p>
          <p class="novel-desc">{{ novel.description || '暂无简介' }}</p>
          <div class="novel-meta">
            <span class="novel-chapters">共{{ novel.total_chapters || 0 }}章</span>
            <span class="novel-update">更新于{{ novel.update_time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--分页-->
    <template v-if="computedDataSource && computedDataSource.length > 0">
        <div class="a-page-box">
            <a-pagination :current="index" :page-size="size" :total="total" :show-total="() => `共计 ${total} 条`"
                @change="onChange" />
        </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { mockCategories, mockNovels } from './mock-data';
import { handleItemClick, isValidValue } from '@/utils/utils';

const router = useRouter();
const route = useRoute();

// 定义 props
const props = withDefaults(defineProps<{
    dataSource?: any[] | { value: any[] },
    onPageChange?: (index: number, size: number) => void,
    pagination?: {
        index: number,
        size: number,
        total: number
    }
}>(), {});

// 处理列表项点击事件
const handleItemClickDetail = (id: string) => {
    handleItemClick({ id: id }, `/app/novel/detail`, router, false, true);
};

// 计算属性，用于处理 dataSource
const computedDataSource = computed(() => {
    if (Array.isArray(props.dataSource)) {
        return props.dataSource;
    } else if (props.dataSource && props.dataSource.value && Array.isArray(props.dataSource.value)) {
        return props.dataSource.value;
    }
    return [];
});

// 分页
const size = computed(() => props.pagination?.size || 30);
const index = computed(() => props.pagination?.index || 1);
const total = computed(() => props.pagination?.total || 0);
const onChange = (current: number, pageSize: number) => {
    // 调用父组件传递的 onPageChange 函数
    if (props.onPageChange) {
        props.onPageChange(current, pageSize);
    }
};

onMounted(async function () {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {

    });
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