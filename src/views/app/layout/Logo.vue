<template>
    <div class="app-logo">
        <a href="/">
            <i class="iconfont"></i>
            <span>MyBook </span><b>Beta</b>
            <p>Tell the world we were here!</p>
        </a>
    </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.app-logo{
	height: 40px;
	line-height: 20px;
	flex: 1;
	max-width: 200px;
}
.app-logo span{
	font-weight: bold;
	font-size: 28px;
	/*text-shadow: -2px 2px 4px rgba(0,0,0,0.3);*/
	color: #FF5722;
}
.app-logo b{
	font-size: 16px;
	color: #666;
	font-weight: normal;
}
/* ==================== 
手机设备响应式样式 (< 768px)
==================== */
@media (max-width: 767px) {
    .app-logo{
        display: none;
    }
}
</style>