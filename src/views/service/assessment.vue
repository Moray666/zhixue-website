<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="学生姓名">
              <el-input v-model="queryParams.name" placeholder="请输入关键字" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员账号">
              <el-input v-model="queryParams.account" placeholder="请输入关键字" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="伴学师">
              <el-select v-model="queryParams.teacher" placeholder="伴学师" clearable style="width: 100%">
                <el-option label="陈逸凡" value="1" />
                <el-option label="马方旭" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科目">
              <el-select v-model="queryParams.subject" placeholder="全部" clearable style="width: 100%">
                <el-option label="数学" value="math" />
                <el-option label="英语" value="english" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="会员年级">
              <el-select v-model="queryParams.grade" placeholder="全部" clearable style="width: 100%">
                <el-option label="七年级" value="7" />
                <el-option label="八年级" value="8" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评测结果">
              <el-select v-model="queryParams.result" placeholder="请选择" clearable style="width: 100%">
                <el-option label="优秀" value="excellent" />
                <el-option label="良好" value="good" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评测完成时间">
              <el-date-picker 
                v-model="queryParams.dateRange" 
                type="daterange" 
                range-separator="至" 
                start-placeholder="开始日期" 
                end-placeholder="结束日期" 
                style="width: 250px"
              />
              <el-button type="primary" style="margin-left: 15px;">搜索</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <el-button type="primary" icon="Plus">新的评测</el-button>
        <div class="toolbar-right">
          <span class="status-text">当前：<span class="text-blue cursor-pointer">允许自主评测</span></span>
          <span class="status-text" style="margin-left: 15px;">已设置 <span class="text-blue">0人</span> 不允许 <el-icon><ArrowRight /></el-icon></span>
        </div>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%" empty-text="暂无数据">
        <el-table-column prop="studentName" label="学生姓名" min-width="100" align="center" />
        <el-table-column prop="grade" label="会员年级" width="100" align="center" />
        <el-table-column prop="teacher" label="伴学师" width="100" align="center" />
        <el-table-column prop="subject" label="评测科目" width="100" align="center" />
        <el-table-column prop="format" label="评测形式" width="100" align="center" />
        <el-table-column prop="scope" label="评测范围" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="createTime" label="评测创建时间" width="160" align="center" />
        <el-table-column prop="creator" label="创建人" width="100" align="center" />
        <el-table-column prop="result" label="评测结果" width="100" align="center" />
        <el-table-column prop="finishTime" label="评测完成时间" width="160" align="center" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small">详情</el-button>
            <el-button link type="danger" size="small">删除</el-button>
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
import { ArrowRight } from '@element-plus/icons-vue'

const queryParams = reactive({
  name: '', account: '', teacher: '', subject: '', grade: '', result: '', dateRange: []
})

const tableData = ref([])
</script>

<style scoped>
.app-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
.search-wrapper { margin-bottom: 15px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.toolbar-right { font-size: 13px; color: #606266; display: flex; align-items: center; }
.text-blue { color: #409EFF; }
.cursor-pointer { cursor: pointer; }
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>