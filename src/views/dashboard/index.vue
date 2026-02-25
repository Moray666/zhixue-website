<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      
      <el-col :span="16">
        <el-card class="welcome-card" shadow="hover">
          <div class="welcome-content">
            <div class="text-area">
              <h2 class="greeting">{{ timeGreeting }}，管理员：马方旭</h2>
              <p class="subtitle">欢迎登录智学时光书房管理系统</p>
              <div class="quote-box">
                <p>“ 拾取光阴，追逐梦想！追光的人，必将身披万丈光芒！ ”</p>
              </div>
              <el-button type="primary" round style="margin-top: 20px;">开始今日工作</el-button>
            </div>
            <div class="image-area">
              <img src="../../assets/vue.svg" class="illustration" alt="Welcome" />
            </div>
          </div>
        </el-card>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <div class="data-header">今日签到</div>
              <div class="data-num">128</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <div class="data-header">新增学员</div>
              <div class="data-num" style="color: #67C23A">+3</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="data-card">
              <div class="data-header">待办事项</div>
              <div class="data-num" style="color: #E6A23C">5</div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="8">
        <el-card class="notice-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>产品更新公告栏</span>
              <el-button link type="primary">查看更多</el-button>
            </div>
          </template>
          
          <div class="notice-list">
            <div v-for="(item, index) in noticeList" :key="index" class="notice-item">
              <div class="notice-meta">
                <el-tag :type="item.type" size="small" effect="plain">{{ item.tag }}</el-tag>
                <span class="notice-date">{{ item.date }}</span>
              </div>
              <div class="notice-title" :class="{ 'is-read': item.isRead }">
                {{ item.title }}
                <span v-if="!item.isRead" class="new-badge">NEW</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// 1. 智能问候语逻辑
const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 2. 模拟公告数据
// type: ''(primary), 'success', 'warning', 'danger', 'info'
const noticeList = ref([
  { tag: '教研产品', type: 'success', date: '02-12', title: '拾光记单词-新教材词书上架 (八年级下)', isRead: false },
  { tag: 'IT产品', type: 'primary', date: '02-05', title: '门店后台，新增批量打印功能', isRead: false },
  { tag: '教研产品', type: 'success', date: '02-04', title: '七年级下册阅读理解专项训练更新', isRead: false },
  { tag: '官方公告', type: 'warning', date: '01-30', title: '春节期间系统维护通知', isRead: true },
  { tag: 'IT产品', type: 'primary', date: '01-22', title: '修复了学员考勤导出异常的Bug', isRead: true },
  { tag: '运营管理', type: 'info', date: '01-15', title: '2026年春季招生政策说明', isRead: true },
])
</script>

<style scoped>
.dashboard-container {
  /* 移除 padding，因为 Layout 已经给了 padding */
}

/* 欢迎卡片样式 */
.welcome-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border: none;
}
.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.greeting {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}
.subtitle {
  color: #909399;
  margin-bottom: 20px;
}
.quote-box {
  background: rgba(64, 158, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  color: #409EFF;
  font-weight: 500;
  border-left: 4px solid #409EFF;
}
.image-area {
  width: 200px;
  text-align: center;
}
.illustration {
  width: 150px; /* 这里控制插画大小 */
  height: auto;
}

/* 数据小卡片 */
.data-card {
  text-align: center;
  padding: 10px 0;
}
.data-header {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}
.data-num {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

/* 公告栏样式 */
.notice-card {
  height: 100%; /* 让它撑满高度 */
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notice-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: #999;
}
.notice-title {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  cursor: pointer;
}
.notice-title:hover {
  color: #409EFF;
}
.notice-title.is-read {
  color: #999; /* 已读变灰 */
}
.new-badge {
  color: #f56c6c;
  font-size: 12px;
  font-weight: bold;
  margin-left: 5px;
  transform: scale(0.8);
  display: inline-block;
}
</style>