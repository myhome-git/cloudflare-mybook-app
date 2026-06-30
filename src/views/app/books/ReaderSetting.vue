<template>
  <div class="reader-set">
    <div class="set-content">
      <div class="set-actions">
        <!-- 主题切换 -->
        <a-dropdown :trigger="['click']">
          <a-button size="large">
            <SettingOutlined />主题
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
            Az {{ readerSettings.fontSize }}%
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

const router = useRouter();
const route = useRoute();

// 阅读器设置
const readerSettings = ref({
  theme: 'light' as 'light' | 'sepia' | 'dark',
  fontSize: 100
});

// 主题设置变化
const handleSettingChange = (e: any) => {
  readerSettings.value.theme = e.key as 'light' | 'sepia' | 'dark';
};

// 字体大小变化
const handleFontSizeChange = (e: any) => {
  readerSettings.value.fontSize = parseInt(e.key);
};

onMounted(() => {

});

onUnmounted(() => {

});
</script>

<style scoped>
.reader-set {
  background: #fdfcf8;
  transition: all 0.3s;
}

/* 主题样式 */
.reader-set.theme-sepia {
  background: #f7f3e8;
}

.reader-set.theme-dark {
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

.set-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.set-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.set-actions {
  display: flex;
  gap: 8px;
}

/* ==================== 
手机设备响应式样式 (< 768px)
==================== */
@media (max-width: 767px) {
  /* 顶部导航优化 */
  .reader-set {
    display: block;
  }
}
</style>