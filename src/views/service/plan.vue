<template>
  <div class="app-container">
    <el-card shadow="never" class="main-card">
      <div class="top-actions">
        <el-button type="primary">开始排课</el-button>
        <div class="status-info">
          <span>当前：<span class="text-blue cursor-pointer">允许自主规划</span></span>
          <span style="margin-left: 15px;">已设置 <span class="text-blue">0人</span> 不允许 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="plan-tabs">
        <el-tab-pane label="每日学习规划" name="daily">
          
          <div class="daily-layout">
            <div class="left-main">
              <div class="action-bar">
                <div class="date-nav">
                  <el-button icon="ArrowLeft" circle size="small" />
                  <el-date-picker 
                    v-model="currentDate" 
                    type="date" 
                    :clearable="false"
                    style="width: 140px; margin: 0 10px;"
                    value-format="YYYY年MM月DD日"
                  />
                  <el-button icon="ArrowRight" circle size="small" />
                  <el-button icon="Refresh" circle size="small" style="margin-left: 10px;" />
                </div>
                
                <div class="filter-group">
                  <span class="label">指定伴学师：</span>
                  <el-select v-model="teacher" placeholder="伴学师" style="width: 120px;" clearable>
                    <el-option label="马方旭" value="1" />
                    <el-option label="陈逸凡" value="2" />
                  </el-select>
                  
                  <span class="label" style="margin-left: 15px;">会员姓名</span>
                  <el-input v-model="studentName" placeholder="请输入" style="width: 120px;" clearable />
                  <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                </div>

                <div class="right-btn">
                  <el-button type="primary" plain>批量下载</el-button>
                </div>
              </div>

              <el-table :data="tableData" border stripe style="width: 100%" empty-text="暂无数据">
                <el-table-column prop="name" label="会员姓名" width="100" align="center" />
                <el-table-column prop="grade" label="年级" width="80" align="center" />
                <el-table-column prop="teacher" label="伴学师" width="90" align="center" />
                <el-table-column prop="status" label="到店和登录情况" width="130" align="center" />
                <el-table-column prop="time" label="学习时间" width="100" align="center" />
                <el-table-column prop="content" label="学习内容" min-width="150" align="center" />
                <el-table-column prop="info" label="内容信息" min-width="150" align="center" />
                <el-table-column prop="duration" label="视频时长" width="100" align="center" />
                <el-table-column label="选中未下(0)" width="110" align="center">
                  <template #header>
                    <el-checkbox /> 选中未下(0)
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                  <template #default>
                    <el-button link type="primary" size="small">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pagination-container">
                <el-pagination background layout="total, sizes, prev, pager, next" :total="0" />
              </div>
            </div>

            <div class="right-sidebar">
              <h3 class="sidebar-title">{{ currentDate }}学习规划情况汇总</h3>
              <p class="sidebar-desc">数据实时更新，每月最后一天凌晨3点为最终</p>
              
              <div class="empty-state">
                <img src="../../assets/vue.svg" alt="empty" class="empty-img" style="opacity: 0.3;" />
                <p>今天没有学习规划哦</p>
              </div>
            </div>
          </div>

        </el-tab-pane>
        
        <el-tab-pane label="本月学习规划" name="monthly">
          <el-empty description="本月学习规划开发中..." />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowRight, Refresh } from '@element-plus/icons-vue'

const activeTab = ref('daily')
const currentDate = ref('2026年2月23日')
const teacher = ref('')
const studentName = ref('')
const tableData = ref([])
</script>

<style scoped>
.app-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
.main-card { position: relative; min-height: 700px; }

/* 顶部绝对定位的按钮区 (利用 absolute 放到 Tabs 右上角) */
.top-actions {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  z-index: 10;
}
.status-info { font-size: 13px; color: #606266; margin-left: 20px; display: flex; align-items: center;}
.text-blue { color: #409EFF; }
.cursor-pointer { cursor: pointer; }

/* 每日规划的左右分栏布局 */
.daily-layout {
  display: flex;
  margin-top: 10px;
}
.left-main {
  flex: 1;
  padding-right: 20px;
}
.right-sidebar {
  width: 280px;
  border-left: 1px solid #ebeef5;
  padding-left: 20px;
}

/* 工具栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
.date-nav, .filter-group { display: flex; align-items: center; }
.label { font-size: 13px; color: #606266; margin-right: 8px; }

/* 右侧侧边栏内容 */
.sidebar-title { font-size: 16px; font-weight: bold; color: #303133; margin: 0 0 10px 0; }
.sidebar-desc { font-size: 12px; color: #909399; margin: 0 0 40px 0; line-height: 1.5; }
.empty-state { text-align: center; color: #909399; font-size: 13px; margin-top: 50px; }
.empty-img { width: 120px; margin-bottom: 15px; }

.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>