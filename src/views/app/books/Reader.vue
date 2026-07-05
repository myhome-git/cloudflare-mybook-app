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
          v-if="prevChapterId" 
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
          
          <div class="chapter-content" ref="contentRef" :style="{ fontSize: readerSettings.fontSize }">
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
            v-if="prevChapterId" 
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
          <div style="color:#999;text-align: center;">Loading...</div>
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

// 阅读器设置
const readerSettings = ref({
  theme: '',
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
const folder = ref(``)
const folder_index = ref(``)
const chapterId = ref(``)

// 数据源
const apiURL = `/api/app/books/detail`;
const isServerResult = ref({
    status: 0,
    message: ''
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
        
    }).finally(() => {

    });
};

const handleGetBookChapters = async () => {
    const isServerResultValue = isServerResult.value;
    isServerResultValue.status = 0;
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
            throw new Error(`Failed to fetch chapter content: ${chapterResponse.status}`);
        }
        
        const content = await decompressGzip(chapterResponse);
        
        isServerResultValue.status = 200;
        currentContent.value = content;
        currentChapterTitle.value = chapters.value[currentIndex]?.name || `第${chapterId.value}章`;
        chapterWordCount.value = content.length;
    } catch (err: any) {
        console.error('Error loading chapter:', err);
        isServerResultValue.status = 500;
        isServerResultValue.message = `Error：${err.message}`;
    } finally {
        isServerResultValue.message = isServerResultValue.status === 200 ? '加载完成' : isServerResultValue.message;
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
  handleItemClick({ folder: folder.value, folder_index: folder_index.value }, `/app/books/detail`, router, false, false);
  window.scrollTo(0, 0);
};

// 跳转到章节
const goToChapter = (id: string) => {
  // const params = new URLSearchParams();
  // params.set('id', id);
  // params.set('folder', folder.value);
  // params.set('folder_index', folder_index.value);
  // location.href = `/app/books/read?${params.toString()}`;
  handleItemClick({ folder: folder.value, folder_index: folder_index.value, id }, `/app/books/read`, router, false, false);
  window.scrollTo(0, 0);
};

onMounted(() => {
  folder.value = `${route.query.folder}`;
  folder_index.value = `${route.query.folder_index}`;
  chapterId.value = `${route.query.id}`;

  // 从 localStorage 读取并校验主题，只允许三种合法值
  readerSettings.value.theme = `${localStorage.getItem('readerTheme')}`;
  handleGetURL()
});

onUnmounted(() => {
});

// 监听章节 ID 变化，重新加载内容
watch(() => route.query.id, async (newId) => {
  if (newId) {
    chapterId.value = String(newId);
    // 回到顶部
    location.reload()
  }
});

// 监听主题和字体大小变化
watch(() => readerSettings.value.theme, (newTheme) => {
  document.body.className = newTheme;
});

// 监听window.parent.postMessage消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'themeChange') {
    readerSettings.value.theme = event.data.theme;
  } else if (event.data.type === 'fontSizeChange') {
    readerSettings.value.fontSize = event.data.fontSize;
  }
});
</script>

<style scoped>
.reader-container {
  min-height: 100vh;
  transition: all 0.3s;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.reader-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
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
  border: 1px solid #eee;
}

.chapter-info {
  margin-bottom: 32px;
  text-align: center;
}

.chapter-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.chapter-meta {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.chapter-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
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
  color: #333;
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
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.chapter-nav-btn:hover {
  background: #e8e7e3;
  border-color: #3f3f3f;
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {
  .header-content {
    padding: 0;
    justify-content: space-between;
  }

  .reader-title {
    font-size: 14px;
    max-width: 120px;
    white-space: nowrap;
  }

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
    font-size: 19px;
    margin-bottom: 6px;
  }

  .chapter-meta {
    font-size: 13px;
  }

  .chapter-content {
    font-size: 16px;
    line-height: 1.75;
  }

  .chapter-content p {
    margin: 1em 0;
    text-align: justify;
  }

  .chapter-content h3 {
    font-size: 18px;
    margin: 20px 0 12px 0;
    color: inherit;
  }

  .chapter-content strong {
    color: inherit;
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
<style>
body.default .app-win{
  background-color: #fdfcf8;
}
body.green .app-win{
  background-color: #cddfcd;
}
body.blue .app-win{
  background-color: #cfdde1;
}
body.pink .app-win{
  background-color: #ebcece;
}
body.gray .app-win{
  background-color: #d0d0d0;
}
body.sepia .app-win{
  background-color: #ede7da;
}
body.dark .app-win{
  background-color: #1a1a1a;
}

/**夜间模式样式，覆盖阅读器内容区域的背景色和文字颜色*/
body.dark .layout-nav{
  background-color: #1a1a1a;
  color: #d4d4d4;
}
body.dark .reader-container{
  background-color: #1a1a1a;
  color: #d4d4d4;
}
body.dark .reading-area{
  border: 1px solid #333;
}
body.dark .chapter-content{
  color: #646161;
}
body.dark .chapter-nav-btn{
  background-color: #1a1a1a;
  color: #646161;
  border: 1px solid #333;
}
/**绿色*/
body.green .layout-nav{
  background-color: #cddfcd;
  color: #333;
}
body.green .reader-container{
  background-color: #cddfcd;
  color: #333;
}
body.green .chapter-content{
  color: #333;
}
body.green .chapter-nav-btn{
  background-color: #cddfcd;
  color: #333;
  border: 1px solid #333;
}
/**蓝色*/
body.blue .layout-nav{
  background-color: #cfdde1;
  color: #333;
}
body.blue .reader-container{
  background-color: #cfdde1;
  color: #333;
}
body.blue .chapter-content{
  color: #333;
}
body.blue .chapter-nav-btn{
  background-color: #cfdde1;
  color: #333;
  border: 1px solid #333;
}
/**粉色*/
body.pink .layout-nav{
  background-color: #ebcece;
  color: #333;
}
body.pink .reader-container{
  background-color: #ebcece;
  color: #333;
}
body.pink .chapter-content{
  color: #333;
}
body.pink .chapter-nav-btn{
  background-color: #ebcece;
  color: #333;
  border: 1px solid #333;
}
/**灰色*/
body.gray .layout-nav{
  background-color: #d0d0d0;
  color: #333;
}
body.gray .reader-container{
  background-color: #d0d0d0;
  color: #333;
}
body.gray .chapter-content{
  color: #333;
}
body.gray .chapter-nav-btn{
  background-color: #d0d0d0;
  color: #333;
  border: 1px solid #333;
}

</style>