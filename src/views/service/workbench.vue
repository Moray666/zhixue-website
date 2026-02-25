<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item>
          <el-input v-model="queryParams.keyword" placeholder="会员信息支持拼音搜索" clearable style="width: 200px">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="伴学师">
          <el-select v-model="queryParams.teacher" placeholder="伴学师" clearable style="width: 120px">
            <el-option label="陈逸凡" value="1" />
            <el-option label="马方旭" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="学习时长">
          <el-select v-model="queryParams.duration" placeholder="学习时长" clearable style="width: 120px">
            <el-option label="> 30分钟" value="30" />
            <el-option label="> 1小时" value="60" />
          </el-select>
        </el-form-item>
        <el-form-item label="小测情况">
          <el-select v-model="queryParams.quiz" placeholder="全部" clearable style="width: 100px">
            <el-option label="已完成" value="done" />
            <el-option label="未完成" value="undone" />
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="queryParams.online" placeholder="全部" clearable style="width: 100px">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="queryParams.grade" placeholder="请选择" clearable style="width: 100px">
            <el-option label="七年级" value="7" />
            <el-option label="八年级" value="8" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
          <el-button>导出表</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" border stripe style="width: 100%" empty-text="暂无数据">
        <el-table-column prop="name" label="会员姓名" min-width="120" sortable align="center" />
        <el-table-column prop="grade" label="年级" width="80" align="center" />
        <el-table-column prop="teacher" label="伴学师" width="90" align="center" />
        <el-table-column prop="time" label="学习时间" width="160" align="center" />
        <el-table-column prop="content" label="学习内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="preview" label="预习情况" width="100" align="center" />
        <el-table-column prop="completeRate" label="完播率" width="80" align="center">
          <template #header>
            完播率 <el-tooltip content="视频播放完成的百分比"><el-icon><QuestionFilled /></el-icon></el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="dailyDuration" label="当日学习时长" width="120" align="center" />
        <el-table-column prop="dailyQuiz" label="当日小测情况" width="120" align="center" />
        <el-table-column prop="quizWatch" label="小测观看时长" width="120" align="center" />
        <el-table-column prop="dailyPractice" label="当日练习情况" width="120" align="center" />
        <el-table-column prop="practiceWatch" label="练习观看时长" width="120" align="center" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="0" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Search, QuestionFilled } from '@element-plus/icons-vue'

const queryParams = reactive({
  keyword: '', teacher: '', duration: '', quiz: '', online: '', grade: ''
})

// 根据截图，目前显示暂无数据
const tableData = ref([])
</script>

<style scoped>
.app-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
.search-wrapper { margin-bottom: 15px; }
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>