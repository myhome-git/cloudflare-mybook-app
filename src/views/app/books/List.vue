<template>
  <div class="novel-list-container">
    <!-- 小说列表 - Markdown 风格列表 -->
    <div class="novel-list">
      <div 
        v-for="novel in props.dataSource" 
        :key="novel.id"
        class="novel-list-item"
        @click="handleItemClickDetail(novel)"
      >
        <span class="novel-list-dot">•</span>
        <div class="novel-list-content">
          <span class="novel-list-title">{{ novel.row_num }}</span>
          <span class="novel-list-title">{{ novel.title }}</span>
          <span class="novel-list-author" v-if="novel.author">作者：{{ novel.author }}</span>
          <span class="novel-list-chapters">共{{ novel.total_chapters || 0 }}章</span>
          <span class="novel-list-update" v-if="novel.update_time">更新于{{ novel.update_time }}</span>
        </div>
      </div>
    </div>

    <!--分页-->
    <template v-if="computedDataSource && computedDataSource.length > 0">
        <div class="a-page-box">
            <a-pagination 
                :current="index" 
                :page-size="size" 
                :total="total" 
                :show-total="() => `共计 ${total} 条`"
                show-size-changer
                show-quick-jumper
                show-prev-next-jump
                @change="onChange" 
            />
        </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from 'vue-router';
import { handleItemClick } from '@/utils/utils';

const router = useRouter();

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
const handleItemClickDetail = (novel: any) => {
  handleItemClick({ id: novel.id, folder: novel.folder, folder_index: novel.folder_index }, `/app/books/detail`, router, false, false);
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
    if (props.onPageChange) {
        props.onPageChange(current, pageSize);
    }
};
</script>

<style scoped>
.novel-list-container {
  margin: 0 auto;
}

/* 小说列表 - Markdown 风格 */
.novel-list {
  background-color: #fff;
  border-radius: 6px;
  padding: 8px 0;
  border: 1px solid #eee;
}

.novel-list-item {
  display: flex;
  align-items: baseline;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px dashed #e1e4e8;
}

.novel-list-item:last-child {
  border-bottom: none;
}

.novel-list-item:hover {
  background-color: #f6f8fa;
}

.novel-list-dot {
  display: inline-block;
  margin-right: 12px;
  color: #656d76;
  font-size: 14px;
  line-height: 1.8;
  flex-shrink: 0;
}

.novel-list-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  font-size: 14px;
  color: #24292f;
}

.novel-list-title {
  font-weight: 500;
  color: #0969da;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.novel-list-author,
.novel-list-chapters,
.novel-list-update {
  color: #656d76;
  white-space: nowrap;
  font-size: 13px;
}

/* 分页 */
.a-page-box {
  text-align: center;
  padding: 24px 0;
  background-color: #e6f4ff;
}
</style>