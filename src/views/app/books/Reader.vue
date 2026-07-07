<template>
  <div class="reader-container" :class="readerSettings.theme">
    <!-- 阅读器内容区域 -->
    <div class="reader-content">
      <!-- 章节导航 -->
      <div class="chapter-nav-buttons" v-if="loading">
        <button 
          v-if="prevChapterId" 
          class="chapter-nav-btn"
          @click="goToChapter(prevChapterId)"
        >
          <ArrowLeftOutlined />上一章
        </button>
        <button 
          class="chapter-nav-btn"
          @click="goToChapters()"
        >
          目录
        </button>
        <button 
          v-if="nextChapterId" 
          class="chapter-nav-btn"
          @click="goToChapter(nextChapterId)"
        >
          下一章<ArrowRightOutlined />
        </button>
        <button class="chapter-nav-btn"
          @click="readerSettings.show = !readerSettings.show"
        >
          <SettingOutlined /> 设置
        </button>
      </div>
      <template v-if="readerSettings.show">
        <ReaderSetting></ReaderSetting>
      </template>
      <!-- 阅读内容 -->
      <template v-if="currentContent">
       <div class="reading-area" :style="{ fontSize: readerSettings.fontSize }">
          <div class="chapter-info">
            <h2 class="chapter-name">{{ currentChapterTitle }}</h2>
            <p class="chapter-meta">作者：{{ author }} , 字数：{{ chapterWordCount }}</p>
          </div>
          
          <div class="chapter-content" ref="contentRef">
            <div v-html="renderContent(currentContent)"></div>
          </div>
        </div>
        <!-- 章节导航 -->
        <div class="chapter-nav-buttons">
          <button 
            v-if="prevChapterId" 
            class="chapter-nav-btn"
            @click="goToChapter(prevChapterId)"
          >
            <ArrowLeftOutlined /> 上一章
          </button>
          <button 
            class="chapter-nav-btn"
            @click="goToChapters()"
          >
            目录
          </button>
          <button 
            v-if="nextChapterId" 
            class="chapter-nav-btn"
            @click="goToChapter(nextChapterId)"
          >
            下一章 <ArrowRightOutlined />
          </button>
        </div>
       </template>
       <template v-else>
          <div class="load-msg">{{ isServerResult.message }}</div>
        </template>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue, handleItemClick } from "@/utils/utils.js";
import ReaderSetting from './ReaderSetting.vue';

const router = useRouter();
const route = useRoute();

// 数据状态
const chapters = ref<any[]>([]);
const loading = ref(false);

// 主题设置
const readerSettings = ref({
  theme: 'default',
  fontSize: `${localStorage.getItem('readerFontSize') || '18px'}`,
  show: false
});

// 当前章节信息
const currentChapterId = ref('');
const currentChapterTitle = ref('');
const author = ref('')
const chapterWordCount = ref(0);
const prevChapterId = ref('');
const nextChapterId = ref('');
const currentContent = ref('');

// 目录章节列表
const catalogChapters = computed(() => chapters.value);

// 渲染内容（简单 Markdown 转 HTML）
const renderContent = (content: string) => {
  if (!content) return '<p>暂无内容</p>';
  
  return content
    .split('\n')
    .filter((line: string) => line.trim())
    .map((line: string) => {
      if (line.startsWith('#')) {
        return `<h3>${line.replace(/^#+\s*/, '')}</h3>`;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
      } else {
        return `<p>${line}</p>`;
      }
    })
    .join('');
};

// 参数
const fileURL = ref(``)
const file_path = ref(``)
const folder = ref(``)
const folder_index = ref(``)
const chapterId = ref(``)

// 数据源
const apiURL = `/api/app/books/detail`;
const isServerResult = ref({
    status: 100,
    message: 'Loading...'
});

const handleGetURL = () => {
    let sendParams = Object.assign({});
    request({
        url: `${apiURL}`,
        params: sendParams
    }).then((data: any) => {
        const result = data.result;
        fileURL.value = result.url;
        handleGetBookChapters();
    }).catch((err: any) => {
        isServerResult.value.status = 500;
        isServerResult.value.message = `Error：${err.message || err.data.message}`;
    }).finally(() => {
    });
};

const handleGetBookChapters = async () => {
    const isServerResultValue = isServerResult.value;
    isServerResultValue.status = 100;
    isServerResultValue.message = 'Loading...';
    try {
        // 先获取章节目录列表
        const catalogUrl = [fileURL.value, folder.value, folder_index.value].join('/');
        const catalogResponse = await fetch(catalogUrl);
        
        if (!catalogResponse.ok) {
            throw new Error(`Failed to fetch catalog: ${catalogResponse.status}`);
        }
        
        const catalogData = await catalogResponse.json();
        loading.value = true;

        // 作者
        author.value = catalogData.author;

        // 清空并填充章节列表
        chapters.value = [];
        catalogData.chapters.forEach((chapter: any) => {
          // 过滤重复章节
          if (!chapters.value.some((ch: any) => ch.id === chapter.file)){
            chapters.value.push({
                id: chapter.file,
                name: chapter.title || chapter.name || `第${chapter.file}章`
            });
          }
        });
        
        // 查找当前章节在列表中的位置
        const currentIndex = chapters.value.findIndex((ch: any) => ch.id === chapterId.value);
        
        // 设置前后章节
        if (currentIndex > 0) {
            prevChapterId.value = chapters.value[currentIndex - 1].id;
        } else {
            prevChapterId.value = '';
        }
        
        if (currentIndex < chapters.value.length - 1) {
            nextChapterId.value = chapters.value[currentIndex + 1].id;
        } else {
            nextChapterId.value = '';
        }
        
        // 再获取当前章节内容
        const chapterUrl = [fileURL.value, folder.value, `${chapterId.value}.txt.gz`].join('/');
        const chapterResponse = await fetch(chapterUrl);
        
        if (!chapterResponse.ok) {
          throw new Error(`Failed to fetch chapter: ${chapterResponse.status}`);
        }
        
        const content = await decompressGzip(chapterResponse);
        
        isServerResultValue.status = 200;
        isServerResultValue.message = 'Data loaded successfully';
        currentContent.value = content;
        currentChapterTitle.value = chapters.value[currentIndex]?.name || `第${chapterId.value}章`;
        chapterWordCount.value = content.length;
    } catch (err: any) {
        isServerResultValue.status = 500;
        isServerResultValue.message = `Error：${err.message || err.data?.message}`;
    }
};

// gzip 解压函数
const decompressGzip = async (response: Response): Promise<string> => {
    try {
        // 使用 arrayBuffer 获取响应数据
        const arrayBuffer = await response.arrayBuffer();
        const compressedData = new Uint8Array(arrayBuffer);
        
        // 使用 DecompressionStream 解压 gzip
        const decompressedStream = new DecompressionStream('gzip');
        const writer = decompressedStream.writable.getWriter();
        
        // 写入压缩数据并关闭
        writer.write(compressedData);
        writer.close();
        
        // 读取解压后的数据
        const reader = decompressedStream.readable.getReader();
        const resultChunks: Uint8Array[] = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
                resultChunks.push(value);
            }
        }
        
        // 合并结果
        const resultTotalLength = resultChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const resultMerged = new Uint8Array(resultTotalLength);
        let resultOffset = 0;
        for (const chunk of resultChunks) {
            resultMerged.set(chunk, resultOffset);
            resultOffset += chunk.length;
        }
        
        // 转换为字符串
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(resultMerged);
    } catch (error) {
        console.error('Decompression error:', error);
        throw error;
    }
};

// 跳转到目录
const goToChapters = () => {
  handleItemClick({ file_path: file_path.value, folder: folder.value, folder_index: folder_index.value }, `/app/books/detail`, router, false, false);
  window.scrollTo(0, 0);
};

// 跳转到章节
const goToChapter = (id: string) => {
  // const params = new URLSearchParams();
  // params.set('id', id);
  // params.set('folder', folder.value);
  // params.set('folder_index', folder_index.value);
  // location.href = `/app/books/read?${params.toString()}`;
  handleItemClick({ file_path: file_path.value, folder: folder.value, folder_index: folder_index.value, id }, `/app/books/read`, router, false, false);
  window.scrollTo(0, 0);
};

// 监听window.parent.postMessage消息
const messageEventListener = (event: MessageEvent) => {
  // console.log('Received message:', event.data);
  if (event.data.type === 'themeChange') {
    readerSettings.value.theme = event.data.theme;
  } else if (event.data.type === 'fontSizeChange') {
    readerSettings.value.fontSize = event.data.fontSize;
  }
};

onMounted(() => {
  file_path.value = `${route.query.file_path}`;
  folder.value = `${route.query.folder}`;
  folder_index.value = `${route.query.folder_index}`;
  chapterId.value = `${route.query.id}`;
  handleGetURL()
  window.addEventListener('message', messageEventListener);
});

onUnmounted(() => {
  window.removeEventListener('message', messageEventListener);
});

// 监听章节 ID 变化，重新加载内容
watch(() => route.query.id, async (newId) => {
  if (newId) {
    chapterId.value = String(newId);
    // 回到顶部
    location.reload()
  }
});

</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  transition: all 0.3s;
}
.reader-container .load-msg{
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  padding: 20px;
  text-align: center;
}

/* 阅读器内容 */
.reader-content {
  padding-bottom: 40px;
  margin: 0 auto;
}

/* 阅读区域 */
.reading-area {
  padding: 20px;
  font-size: 20px;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  border-width: 1px;
  border-style: solid;
  border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}

.chapter-info {
  margin-bottom: 32px;
  text-align: center;
}

.chapter-name {
  font-weight: bold;
  margin: 0 0 8px 0;
  font-size: 120%;
}

.chapter-meta {
  font-size: 80%;
  margin: 0;
}

.chapter-content {
  line-height: 1.8;
  min-height: 400px;
}

.chapter-content p {
  margin: 1em 0;
  text-align: justify;
}

.chapter-content h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 16px 0;
}

/* 章节切换按钮 */
.chapter-nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0px;
}

.chapter-nav-btn {
  flex: 1;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
  border-width: 1px;
  border-style: solid;
  border-color: rgba(var(--appwin--border-color-rgb), var(--appwin--border-color-opacity));
}

.chapter-nav-btn:hover {
  background-color: rgba(var(--appwin--bg-color-rgb), 1);
  border-color: rgba(var(--appwin--border-color-rgb), 1);
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {

  .header-actions {
    gap: 4px;
  }

  .header-actions :deep(.ant-btn) {
    padding: 6px 8px;
    min-width: 36px;
  }

  .header-actions :deep(.ant-btn i) {
    font-size: 16px;
  }

  /* 阅读器内容区域 */
  .reader-content {
    max-width: 100%;
  }

  /* 阅读区域优化 */
  .reading-area {
    padding: 16px 14px;
  }

  .chapter-info {
    margin-bottom: 24px;
  }

  .chapter-name {
    margin-bottom: 6px;
  }

  .chapter-content {
    line-height: 1.75;
  }

  .chapter-content p {
    margin: 1em 0;
    text-align: justify;
  }

  .chapter-content h3 {
    margin: 20px 0 12px 0;
  }

  /* 章节切换按钮优化 */
  .chapter-nav-buttons {
    padding: 12px 20px;
  }

  .chapter-nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
