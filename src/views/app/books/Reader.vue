<template>
  <div class="reader-container" :class="readerSettings.theme">
    <!-- 阅读器顶部导航 -->
    <div class="reader-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-content">
        <a-button size="large" @click="goBack">
          <ArrowLeftOutlined />返回
        </a-button>
        <div class="header-actions">
          <!-- 主题切换 -->
          <a-dropdown :trigger="['click']">
            <a-button size="large">
              <SettingOutlined />主题切换
            </a-button>
            <template #overlay>
              <a-menu @click="handleSettingChange">
                <a-menu-item key="light">
                  <HomeOutlined /> 浅色
                </a-menu-item>
                <a-menu-item key="sepia">
                  <CloudOutlined /> 护眼
                </a-menu-item>
                <a-menu-item key="dark">
                  <ThunderboltOutlined /> 深色
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 字体大小 -->
          <a-dropdown :trigger="['click']">
            <a-button size="large">
              字体大小 {{ readerSettings.fontSize }}%
            </a-button>
            <template #overlay>
              <a-menu @click="handleFontSizeChange">
                <a-menu-item key="80">小</a-menu-item>
                <a-menu-item key="100">中</a-menu-item>
                <a-menu-item key="120">大</a-menu-item>
                <a-menu-item key="140">超大</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <!-- 阅读器内容区域 -->
    <div class="reader-content">
      <!-- 阅读内容 -->
      <div class="reading-area">
        <div class="chapter-info">
          <h2 class="chapter-name">{{ currentChapterTitle }}</h2>
          <p class="chapter-meta">字数：{{ chapterWordCount }}</p>
        </div>
        
        <div class="chapter-content" ref="contentRef" :style="{ fontSize: readerSettings.fontSize + '%' }">
          <div v-html="renderContent(currentContent)"></div>
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
            v-if="nextChapterId" 
            class="chapter-nav-btn"
            @click="goToChapter(nextChapterId)"
          >
            下一章 <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  HomeOutlined,
  CloudOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue';
// @ts-ignore
import request from "@/utils/request.js";
import { isValidValue, handleItemClick } from "@/utils/utils.js";

const router = useRouter();
const route = useRoute();

// 数据状态
const chapters = ref<any[]>([]);
const loading = ref(false);

// 阅读器设置
const readerSettings = ref({
  theme: 'light' as 'light' | 'sepia' | 'dark',
  fontSize: 100
});

// 滚动状态
const isScrolled = ref(false);
const showCatalog = ref(false);

// 当前章节信息
const currentChapterId = ref('');
const currentChapterTitle = ref('');
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
        
        // 清空并填充章节列表
        chapters.value = [];
        catalogData.chapters.forEach((chapter: any) => {
            chapters.value.push({
                id: chapter.file,
                name: chapter.title || chapter.name || `第${chapter.file}章`
            });
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

// 返回上一页
const goBack = () => {
  router.back();
};

// 跳转到章节
const goToChapter = (id: string) => {
  handleItemClick({ folder: folder.value, folder_index: folder_index.value, id }, `/app/books/read`, router, false, false);
  window.scrollTo(0, 0);
};

// 主题设置变化
const handleSettingChange = (e: any) => {
  readerSettings.value.theme = e.key as 'light' | 'sepia' | 'dark';
};

// 字体大小变化
const handleFontSizeChange = (e: any) => {
  readerSettings.value.fontSize = parseInt(e.key);
};

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  folder.value = `${route.query.folder}`;
  folder_index.value = `${route.query.folder_index}`;
  chapterId.value = `${route.query.id}`;
  handleGetURL()
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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
  background: #fdfcf8;
  transition: all 0.3s;
}

/* 主题样式 */
.reader-container.theme-sepia {
  background: #f7f3e8;
}

.reader-container.theme-dark {
  background: #1a1a1a;
  color: #d4d4d4;
}

/* 顶部导航 */
.reader-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.reader-header.header-scrolled {
  background: rgba(255, 255, 255, 0.98);
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

.header-actions {
  display: flex;
  gap: 8px;
}

/* 阅读器内容 */
.reader-content {
  padding-top: 60px;
  padding-bottom: 100px;
  max-width: 800px;
  margin: 0 auto;
}

/* 阅读区域 */
.reading-area {
  padding: 20px;
  font-size: 20px;
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
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e8e8e8;
}

.chapter-nav-btn {
  flex: 1;
  padding: 12px 24px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chapter-nav-btn:hover {
  background: #e8e7e3;
  border-color: #3f3f3f;
}

/* ==================== 
   平板设备响应式样式 (768px - 991px)
   ==================== */
@media (max-width: 991px) and (min-width: 768px) {
  .reader-header {
    padding: 10px 16px;
  }

  .header-content {
    padding: 0 16px;
  }

  .reader-title {
    font-size: 15px;
    max-width: 180px;
  }

  .header-actions :deep(.ant-btn) {
    padding: 6px 10px;
  }

  .reader-content {
    padding-top: 55px;
    padding-bottom: 90px;
  }

  .reading-area {
    padding: 18px;
  }

  .chapter-name {
    font-size: 22px;
  }

  .chapter-content {
    font-size: 17px;
    line-height: 1.8;
  }

  .chapter-nav-buttons {
    gap: 12px;
    margin-top: 40px;
  }

  .chapter-nav-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}

/* ==================== 
   手机设备响应式样式 (< 768px)
   ==================== */
@media (max-width: 767px) {
  /* 顶部导航优化 */
  .reader-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    padding: 0 12px;
    z-index: 100;
  }

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
    padding-top: 50px;
    padding-bottom: 70px;
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
    color: inherit;
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
    flex-direction: column;
    gap: 10px;
    margin-top: 32px;
    padding-top: 24px;
  }

  .chapter-nav-btn {
    padding: 10px 18px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* ==================== 
   小屏手机响应式样式 (< 480px)
   ==================== */
@media (max-width: 479px) {
  /* 顶部导航优化 */
  .reader-header {
    height: 45px;
    padding: 0 10px;
  }

  .header-content {
    justify-content: space-between;
  }

  .reader-title {
    font-size: 13px;
    max-width: 100px;
  }

  .header-actions {
    gap: 3px;
  }

  .header-actions :deep(.ant-btn) {
    padding: 5px 7px;
    min-width: 32px;
  }

  .header-actions :deep(.ant-btn i) {
    font-size: 15px;
  }

  /* 阅读器内容区域 */
  .reader-content {
    padding-top: 45px;
    padding-bottom: 65px;
  }

  /* 阅读区域优化 */
  .reading-area {
    padding: 14px 12px;
  }

  .chapter-name {
    font-size: 17px;
    margin-bottom: 5px;
  }

  .chapter-meta {
    font-size: 12px;
  }

  .chapter-content {
    font-size: 15px;
    line-height: 1.7;
  }

  .chapter-content h3 {
    font-size: 16px;
    margin: 16px 0 10px 0;
  }

  /* 章节切换按钮优化 */
  .chapter-nav-buttons {
    gap: 8px;
    margin-top: 28px;
    padding-top: 20px;
  }

  .chapter-nav-btn {
    padding: 9px 16px;
    font-size: 12px;
  }
}
</style>