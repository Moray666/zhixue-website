<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="6"><el-form-item label="会员姓名"><el-input v-model="queryParams.name" placeholder="请输入" clearable /></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="会员账号"><el-input v-model="queryParams.account" placeholder="请输入" clearable /></el-form-item></el-col>
          <el-col :span="6">
            <el-form-item label="伴学师">
              <el-select v-model="queryParams.teacher" placeholder="请选择" clearable style="width:100%">
                 <el-option label="陈逸凡" value="1"/><el-option label="马方旭" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"><el-form-item label="学段"><el-select v-model="queryParams.phase" placeholder="请选择" style="width:100%" clearable><el-option label="初中" value="cz"/></el-select></el-form-item></el-col>
          
          <el-col :span="6"><el-form-item label="科目"><el-select v-model="queryParams.subject" placeholder="请选择" style="width:100%" clearable><el-option label="数学" value="math"/></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="课程难度"><el-select v-model="queryParams.diff" placeholder="请选择" style="width:100%" clearable><el-option label="普通" value="normal"/></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="教材版本"><el-select v-model="queryParams.book" placeholder="请选择" style="width:100%" clearable><el-option label="人教版" value="rj"/></el-select></el-form-item></el-col>
          <el-col :span="6"><el-form-item label="模块"><el-select v-model="queryParams.module" placeholder="请选择" style="width:100%" clearable><el-option label="全部" value="all"/></el-select></el-form-item></el-col>
          
          <el-col :span="6"><el-form-item label="累计学习时长"><el-select v-model="queryParams.timeTotal" placeholder="请选择" style="width:100%" clearable></el-select></el-form-item></el-col>
          <el-col :span="9">
            <el-form-item label="学习时间">
              <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="至" start-placeholder="2026-01-24 10:06:25" end-placeholder="2026-02-23 10:06:25" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="9" style="text-align: right;">
            <el-button type="primary">搜索</el-button>
            <el-button>重置</el-button>
            <el-button>导出表</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column label="会员姓名" width="120" align="center">
          <template #default="{ row }">
            <span style="color: #409EFF; cursor: pointer;">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="60" align="center" />
        <el-table-column prop="teacher" label="伴学师" width="80" align="center" />
        <el-table-column prop="contentName" label="内容名称" min-width="150" show-overflow-tooltip align="center"/>
        <el-table-column prop="contentInfo" label="内容信息" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column prop="lastTime" label="最新学习时间" width="100" align="center" />
        
        <el-table-column label="预习情况" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.preview === '未完成' ? 'text-red' : 'text-green'">{{ row.preview }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalTime" label="累计学习时长" width="100" align="center" />
        
        <el-table-column label="小测情况" min-width="160" align="center">
          <template #default="{ row }">
            <div v-if="row.quiz !== '未完成'" class="status-group">
              <el-icon color="#67C23A"><CircleCheckFilled /></el-icon> 3 
              <el-icon color="#F56C6C"><CircleCloseFilled /></el-icon> 0 
              <span class="text-warning">100%</span> 
              <span class="text-blue cursor-pointer"> | 查看图片</span>
            </div>
            <span v-else class="text-red">未完成</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="quizWatch" label="小测观看时长" width="100" align="center" />
        
        <el-table-column label="练习情况" min-width="160" align="center">
          <template #default="{ row }">
             <div v-if="row.practice !== '未完成'" class="status-group">
              <el-icon color="#67C23A"><CircleCheckFilled /></el-icon> 4 
              <el-icon color="#F56C6C"><CircleCloseFilled /></el-icon> 0 
              <span class="text-warning">{{ row.practice }}</span> 
              <span class="text-blue cursor-pointer"> | 查看图片</span>
            </div>
            <span v-else class="text-red">未完成</span>
          </template>
        </el-table-column>

        <el-table-column prop="practiceWatch" label="练习观看时长" width="100" align="center" />
        
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template #default>
            <span class="text-blue cursor-pointer">资料下载</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container"><el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="10" /></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const queryParams = reactive({
  name: '', account: '', teacher: '', phase: '', subject: '', diff: '', book: '', module: '', timeTotal: '', dateRange: []
})

const tableData = ref([
  { name: '刘馨蔓(2651)', grade: '高二', teacher: '马方旭', contentName: '小说人物形象类题', contentInfo: '高中历史/数学/济南版2024(高中代数)', lastTime: '2026-02-14 17:22:11', preview: '未完成', totalTime: '0分7秒', quiz: '未完成', quizWatch: '--', practice: '未完成', practiceWatch: '--' },
  { name: '刘馨蔓(2651)', grade: '高一', teacher: '陈逸凡', contentName: '函数与导数综合', contentInfo: '初中数学/数学/人教版(初中代数)', lastTime: '2026-02-06 00:05:50', preview: '未完成', totalTime: '37分45秒', quiz: '完成', quizWatch: '0分0秒', practice: '33%', practiceWatch: '0分0秒' },
  { name: '刘馨蔓(2651)', grade: '高一', teacher: '陈逸凡', contentName: '【考前冲刺】动量基础题型', contentInfo: '高中数学/数学/人教A版(考前冲刺)', lastTime: '2026-02-04 22:33:51', preview: '未完成', totalTime: '18秒', quiz: '未完成', quizWatch: '--', practice: '未完成', practiceWatch: '--' },
  { name: '陈逸凡(9176)', grade: '七年级', teacher: '陈逸凡', contentName: '一元二次方程根与系数', contentInfo: '初中数学/数学/青岛版2024(七年级)', lastTime: '2026-02-02 21:54:06', preview: '未完成', totalTime: '3分0秒', quiz: '完成', quizWatch: '0分0秒', practice: '完成', practiceWatch: '0分0秒' }
])
</script>

<style scoped>
.app-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
.search-wrapper { margin-bottom: 15px; }
.text-red { color: #F56C6C; }
.text-green { color: #67C23A; }
.text-warning { color: #E6A23C; font-weight: bold; margin: 0 4px; }
.text-blue { color: #409EFF; }
.cursor-pointer { cursor: pointer; }
.status-group { display: flex; align-items: center; justify-content: center; font-size: 13px; }
.status-group .el-icon { margin: 0 2px 0 6px; }
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
/* 优化表头紧凑度 */
:deep(.el-table .cell) { padding: 0 4px; font-size: 13px; }
</style>