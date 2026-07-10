<template>
  <div class="reader-set">
    <div class="set-content">
      <div class="set-actions">
        <!-- 主题切换 -->
        <a-dropdown :trigger="['click']">
          <a-button size="large">
            <SettingOutlined />主题-{{ readerSettings.theme }}
          </a-button>
          <template #overlay>
            <a-menu @click="handleSettingChange">
              <a-menu-item key="default">
                默认
              </a-menu-item>
              <a-menu-item key="green">
                <HomeOutlined /> 护眼绿
              </a-menu-item>
              <a-menu-item key="blue">
                <CloudOutlined /> 海水蓝
              </a-menu-item>
              <a-menu-item key="pink">
                <CloudOutlined /> 胭脂粉
              </a-menu-item>
              <a-menu-item key="gray">
                <CloudOutlined /> 冷淡灰
              </a-menu-item>
              <a-menu-item key="sepia">
                <CloudOutlined /> 纸张黄
              </a-menu-item>
              <a-menu-item key="dark">
                <ThunderboltOutlined /> 夜间模式
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <!-- 字体大小 -->
        <a-dropdown :trigger="['click']">
          <a-button size="large">
            Az {{ readerSettings.fontSize }}
          </a-button>
          <template #overlay>
            <a-menu @click="handleFontSizeChange">
              <a-menu-item key="14px">14</a-menu-item>
              <a-menu-item key="16px">16</a-menu-item>
              <a-menu-item key="18px">18</a-menu-item>
              <a-menu-item key="20px">20</a-menu-item>
              <a-menu-item key="22px">22</a-menu-item>
              <a-menu-item key="24px">24</a-menu-item>
              <a-menu-item key="26px">26</a-menu-item>
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
  theme: 'green',
  fontSize: `${localStorage.getItem('readerFontSize') || '18px'}`
});

// 主题设置变化
const handleSettingChange = (e: any) => {
  readerSettings.value.theme = e.key;
};
// 字体大小设置变化
const handleFontSizeChange = (e: any) => {
  readerSettings.value.fontSize = e.key;
};
// 监听主题变化
watch(() => readerSettings.value.theme, (newValue) => {
  document.body.className = newValue;
  localStorage.setItem('readerTheme', newValue);
  window.parent.postMessage(
    {
      type: 'themeChange',
      theme: newValue
    },
    '*'
  );
});
// 监听字体大小变化
watch(() => readerSettings.value.fontSize, (newValue) => {
  document.body.style.fontSize = newValue;
  localStorage.setItem('readerFontSize', newValue);
  // 发送消息给父组件，通知字体大小变化
  window.parent.postMessage(
    {
      type: 'fontSizeChange',
      fontSize: newValue
    },
    '*'
  );
});

onMounted(() => {

});

onUnmounted(() => {

});
</script>

<style scoped>
.reader-set {
  transition: all 0.3s;
}

.set-content {
  /* background: rgba(255, 255, 255, 0.95); */
  background-color: rgba(var(--appwin--bg-color-rgb), var(--appwin--bg-color-opacity));
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