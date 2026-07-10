<template>
  <div class="novel-list-container">
    <ReadList></ReadList>
    <!-- 小说列表 - Markdown 风格列表 -->
    <div class="novel-list">
      <div class="h1">列表</div>
      <div 
        v-for="novel in props.dataSource" 
        :key="novel.id"
        class="novel-list-item"
        @click="handleItemClickDetail(novel)"
      >
        <div class="novel-list-item-title" >
          <span class="novel-list-dot">•{{ novel.row_num }}</span>
          <span>{{ novel.title }}</span>
        </div>
        <div class="novel-list-author-chapters">
          <span v-if="novel.author">作者：{{ novel.author }}</span>
        </div>
        <div>共 {{ novel.total_chapters || 0 }} 章</div>
        <div class="novel-list-update" v-if="novel.update_time">更新于：{{ novel.update_time }}</div>
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
import ReadList from "./ReadList.vue";

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
  handleItemClick({ id: novel.id, file_path: novel.file_path, folder: novel.folder, folder_index: novel.folder_index }, `/app/books/detail`, router, false, false);
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
  /* background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity)); */
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 小说列表 - Markdown 风格 */
.novel-list {
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.novel-list > .h1{
  padding: 16px 20px;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  color: #333;
  font-size: 120%;
  font-weight: bold;
}

.novel-list-item {
  background-color: transparent;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.novel-list-item .novel-list-item-title {
  display: flex;
  align-items: center;
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
}

.novel-list-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.novel-list-author,
.novel-list-chapters,
.novel-list-update {
  white-space: nowrap;
}

/* 分页 */
.a-page-box {
  text-align: center;
  padding: 24px 0;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
}

@media screen and (min-width: 768px) {
  /*平均分布，左对齐*/
  .novel-list-item {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .novel-list-item > * {
    flex: 1;
    text-align: left; /* 确保文字左对齐 */
  }
}
body.dark .novel-list-container{
  background-color: rgba(var(--appwin--bg-color-rgb), 0.05);
  color: #777;
}
body.dark .novel-list-item-title{
  color: #999;
}
body.default .novel-list, 
body.green .novel-list, 
body.blue .novel-list, 
body.pink .novel-list, 
body.gray .novel-list, 
body.sepia .novel-list{
  color: #999;
}
body.default .novel-list-item-title, 
body.green .novel-list-item-title, 
body.blue .novel-list-item-title, 
body.pink .novel-list-item-title, 
body.gray .novel-list-item-title, 
body.sepia .novel-list-item-title{
  color: #333;
}
</style>