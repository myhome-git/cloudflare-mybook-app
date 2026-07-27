<template>
  <!-- 近期阅读 -->
  <div class="novel-list">
    <div class="h1">阅读记录</div>
    <template v-if="readListStorage && readListStorage.length>0">
      <div v-for="novel in readListStorage" 
        :key="novel.folder"
        class="novel-list-item"
        @click="handleItemClickDetail(novel)"
      >
        <div>{{ novel.title }}</div>
        <div>{{ novel.name }}</div>
        <div>{{ novel.author }}</div>
        <div width="1">共 {{ novel.total_chapters }} 章</div>
      </div>
    </template>
    <template v-else>
      <div class="no-data"><span>暂无章节</span></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { handleItemClick } from '@/utils/utils';

const router = useRouter();

const readListStorage = ref(<any>[]);

// 处理列表项点击事件
const handleItemClickDetail = (novel: any) => {
  handleItemClick({ id: novel.id, file_path: novel.file_path, folder: novel.folder, folder_index: novel.folder_index }, `/app/books/read`, router, false, true);
};

onMounted(() => {
  try {
    const list = JSON.parse(localStorage.getItem(`readList`) || ``);
    readListStorage.value.push(...list);
  } catch (error) {
    
  }
});

</script>

<style scoped>

/* 小说列表 - Markdown 风格 */
.novel-list {
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.novel-list > .h1{
  padding: 12px 20px;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  font-size: 120%;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.no-data {
  padding: 20px;
}
.novel-list-item {
  padding: 10px 20px;
  cursor: pointer;
  /* transition: background-color 0.2s; */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}
.novel-list-item:last-child {
  border-bottom-style: none;
}

.novel-list-item:hover {
  background-color: rgba(var(--appwin--bg-color-rgb-hover), var(--appwin--bg-color-opacity-hover));
  color: var(--appwin--color-hover);
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
body.default .h1{
  background-color: rgba(var(--appwin--bg-color-rgb), calc(var(--appwin--bg-color-opacity)));
}
body.dark .novel-list{
  background-color: rgba(var(--appwin--bg-color-rgb), 0.05);
}
</style>