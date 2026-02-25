<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="日报表" name="daily">
          
          <el-form :inline="true" :model="queryParams" class="search-form">
            <el-form-item label="会员姓名"><el-input v-model="queryParams.name" placeholder="请输入" clearable style="width: 130px;"/></el-form-item>
            <el-form-item label="会员账号"><el-input v-model="queryParams.account" placeholder="请输入" clearable style="width: 130px;"/></el-form-item>
            <el-form-item label="伴学师">
              <el-select v-model="queryParams.teacher" placeholder="请选择" clearable style="width: 100px;">
                <el-option label="陈逸凡" value="1"/><el-option label="马方旭" value="2"/>
              </el-select>
            </el-form-item>
            <el-form-item label="反馈状态">
              <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 100px;">
                <el-option label="已反馈" value="done"/><el-option label="未反馈" value="undone"/>
              </el-select>
            </el-form-item>
            <el-form-item label="反馈人"><el-input v-model="queryParams.feedbacker" placeholder="请输入" clearable style="width: 100px;"/></el-form-item>
            <el-form-item label="学习日期">
               <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="-" start-placeholder="2026-01-24" end-placeholder="2026-02-23" style="width: 220px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
              <el-button>重置</el-button>
              <el-button>导出表</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="tableData" border stripe style="width: 100%; margin-top: 10px;">
            <el-table-column prop="date" label="日期" width="120" align="center" />
            <el-table-column label="会员" min-width="140" align="center">
              <template #default="{ row }">
                 <span style="color: #409EFF; cursor: pointer;">{{ row.member }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="teacher" label="伴学师" width="100" align="center" />
            <el-table-column prop="studyTime" label="当日学习时长" width="120" align="center" />
            <el-table-column prop="loginTime" label="最早登录时间" width="180" align="center" />
            
            <el-table-column label="登录状态" width="100" align="center">
              <template #default>
                <span style="color: #909399;">已下线</span>
              </template>
            </el-table-column>
            
            <el-table-column label="反馈状态" width="100" align="center">
               <template #default>
                <span class="text-red">未反馈</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="feedbacker" label="反馈人" width="100" align="center" />
            <el-table-column prop="feedbackTime" label="反馈时间" width="120" align="center" />
            <el-table-column prop="parentMark" label="家长标记状态" width="120" align="center" />
            
            <el-table-column label="操作" width="100" fixed="right" align="center">
              <template #default>
                <span style="color: #909399; cursor: pointer;">已超时</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container"><el-pagination background layout="total, prev, pager, next" :total="20" /></div>
        </el-tab-pane>
        
        <el-tab-pane label="周报表" name="weekly">
          <el-empty description="周报表功能开发中..." />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const activeTab = ref('daily')
const queryParams = reactive({
  name: '', account: '', teacher: '', status: '', feedbacker: '', dateRange: []
})

const tableData = ref([
  { date: '2026-02-14', member: '刘馨蔓(2651)', teacher: '马方旭', studyTime: '0分7秒', loginTime: '2026-02-14 17:21:57', feedbacker: '--', feedbackTime: '--', parentMark: '--' },
  { date: '2026-02-06', member: '刘馨蔓(2651)', teacher: '陈逸凡', studyTime: '0分0秒', loginTime: '2026-02-06 00:05:49', feedbacker: '--', feedbackTime: '--', parentMark: '--' },
  { date: '2026-02-04', member: '刘馨蔓(2651)', teacher: '陈逸凡', studyTime: '46分56秒', loginTime: '2026-02-04 22:17:21', feedbacker: '--', feedbackTime: '--', parentMark: '--' },
  { date: '2026-02-02', member: '刘馨蔓(2651)', teacher: '陈逸凡', studyTime: '18分13秒', loginTime: '2026-02-02 22:14:34', feedbacker: '--', feedbackTime: '--', parentMark: '--' },
  { date: '2026-01-31', member: '刘馨蔓(2651)', teacher: '陈逸凡', studyTime: '3分15秒', loginTime: '2026-01-31 19:32:08', feedbacker: '--', feedbackTime: '--', parentMark: '--' }
])
</script>

<style scoped>
.app-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
.text-red { color: #F56C6C; font-weight: 500;}
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>