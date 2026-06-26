<template>
  <div class="reader-container" :class="readerSettings.theme">
    <!-- 阅读器顶部导航 -->
    <div class="reader-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-content">
        <a-button type="text" size="large" @click="goBack">
          <i class="iconfont icon-arrow-left"></i>
        </a-button>
        <span class="reader-title">{{ currentChapterTitle }}</span>
        <div class="header-actions">
          <!-- 主题切换 -->
          <a-dropdown :trigger="['click']">
            <a-button type="text" size="large">
              <i class="iconfont icon-settings"></i>
            </a-button>
            <template #overlay>
              <a-menu @click="handleSettingChange">
                <a-menu-item key="light">
                  <i class="iconfont icon-sun"></i> 浅色
                </a-menu-item>
                <a-menu-item key="sepia">
                  <i class="iconfont icon-moon"></i> 护眼
                </a-menu-item>
                <a-menu-item key="dark">
                  <i class="iconfont icon-moon-fill"></i> 深色
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 字体大小 -->
          <a-dropdown :trigger="['click']">
            <a-button type="text" size="large">
              <i class="iconfont icon-text"></i> {{ readerSettings.fontSize }}%
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
            <i class="iconfont icon-arrow-left"></i> 上一章
          </button>
          <button 
            v-if="nextChapterId" 
            class="chapter-nav-btn"
            @click="goToChapter(nextChapterId)"
          >
            下一章 <i class="iconfont icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部目录按钮 -->
    <button class="catalog-toggle" @click="showCatalog = !showCatalog">
      <i class="iconfont icon-list"></i>
      目录
    </button>

    <!-- 目录面板 -->
    <div v-show="showCatalog" class="catalog-panel">
      <div class="catalog-header">
        <h3>章节目录</h3>
        <a-button type="text" size="small" @click="showCatalog = false">
          <i class="iconfont icon-close"></i>
        </a-button>
      </div>
      <div class="catalog-list">
        <div 
          v-for="chapter in catalogChapters" 
          :key="chapter.id"
          :class="['catalog-item', { active: currentChapterId === chapter.id }]"
          @click="goToChapter(chapter.id)"
        >
          {{ chapter.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mockChapters } from './mock-data';

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

// 获取章节数据
const fetchChapterData = async () => {
  loading.value = true;
  try {
    // 使用模拟数据
    const chapterId = route.params.id as string;
    
    // 查找对应章节
    const chapter = mockChapters.find(c => c.id === chapterId);
    
    if (chapter) {
      currentChapterId.value = chapter.id;
      currentChapterTitle.value = chapter.name;
      currentContent.value = chapter.content;
      chapterWordCount.value = chapter.content.length;
    } else {
      // 如果没有找到，使用默认章节
      currentChapterId.value = 'c1';
      currentChapterTitle.value = '第一章 秦羽';
      currentContent.value = mockChapters[0]?.content || '# 暂无内容';
      chapterWordCount.value = 500;
    }

    // 生成章节列表
    chapters.value = [
      { id: 'c1', name: '第一章 秦羽' },
      { id: 'c2', name: '第二章 神秘石碑' },
      { id: 'c3', name: '第三章 奇遇' },
      { id: 'c4', name: '第四章 修炼之路' },
      { id: 'c5', name: '第五章 家族试炼' },
      { id: 'c6', name: '第六章 初入宗门' },
      { id: 'c7', name: '第七章 同门比试' },
      { id: 'c8', name: '第八章 秘境探险' },
      { id: 'c9', name: '第九章 突破瓶颈' },
      { id: 'c10', name: '第十章 新的征程' }
    ];

    // 查找前后章节
    const currentIndex = chapters.value.findIndex(c => c.id === currentChapterId.value);
    if (currentIndex > 0) {
      prevChapterId.value = chapters.value[currentIndex - 1].id;
    }
    if (currentIndex < chapters.value.length - 1) {
      nextChapterId.value = chapters.value[currentIndex + 1].id;
    }
  } catch (error) {
    console.error('获取章节数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 跳转到章节
const goToChapter = (chapterId: string) => {
  router.push(`/app/read/${chapterId}`);
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
  fetchChapterData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(() => route.params.id, () => {
  fetchChapterData();
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

/* 目录切换按钮 */
.catalog-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 16px 24px;
  background: #3f3f3f;
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 90;
}

.catalog-toggle:hover {
  background: #555;
  transform: scale(1.05);
}

/* 目录面板 */
.catalog-panel {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transition: right 0.3s;
  z-index: 150;
  display: flex;
  flex-direction: column;
}

.catalog-panel.show {
  right: 0;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.catalog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.catalog-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.catalog-item {
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
  margin-bottom: 8px;
}

.catalog-item:hover {
  background: #e8e7e3;
  color: #333;
}

.catalog-item.active {
  background: #3f3f3f;
  color: #fff;
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

  .catalog-toggle {
    bottom: 25px;
    right: 25px;
    padding: 14px 22px;
    font-size: 13px;
  }

  .catalog-panel {
    width: 280px;
  }

  .catalog-header h3 {
    font-size: 17px;
  }

  .catalog-item {
    padding: 11px 15px;
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

  /* 目录切换按钮优化 */
  .catalog-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    font-size: 13px;
    z-index: 90;
  }

  /* 目录面板优化 */
  .catalog-panel {
    width: 100%;
    right: -100%;
    max-width: none;
  }

  .catalog-header {
    padding: 14px 16px;
  }

  .catalog-header h3 {
    font-size: 16px;
  }

  .catalog-list {
    padding: 14px;
  }

  .catalog-item {
    padding: 10px 14px;
    font-size: 14px;
    margin-bottom: 6px;
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

  /* 目录切换按钮优化 */
  .catalog-toggle {
    bottom: 15px;
    right: 15px;
    padding: 10px 18px;
    font-size: 12px;
  }

  /* 目录面板优化 */
  .catalog-panel {
    width: 100%;
  }

  .catalog-header {
    padding: 12px 14px;
  }

  .catalog-header h3 {
    font-size: 15px;
  }

  .catalog-list {
    padding: 12px;
  }

  .catalog-item {
    padding: 9px 12px;
    font-size: 13px;
    margin-bottom: 5px;
  }
}
</style>