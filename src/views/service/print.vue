<template>
  <div class="service-container">
    <el-card shadow="hover" class="queue-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon class="icon-print"><Printer /></el-icon>
            <span style="margin-left: 8px; font-weight: bold;">打印任务队列</span>
          </div>
          <el-badge :value="printTasks.length" :hidden="printTasks.length === 0" type="danger" />
        </div>
      </template>
      
      <el-table :data="printTasks" style="width: 100%" stripe empty-text="当前暂无打印任务">
        <el-table-column prop="time" label="申请时间" width="150" align="center" />
        <el-table-column prop="student" label="申请人" width="150" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.student }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" @click="finishPrint($index, row)">去打印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Printer } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'

interface PrintTask {
  time: string
  student: string
  fileName: string
}

const printTasks = ref<PrintTask[]>([
  { time: '10:28', student: '刘墨涵', fileName: '八年级上册物理错题集.pdf' },
  { time: '09:15', student: '张子轩', fileName: '七年级英语重点词汇.docx' }
])

const finishPrint = (index: number, row: PrintTask) => {
  printTasks.value.splice(index, 1)
  ElMessage.success(`已发送 "${row.student}" 的文件至打印机！`)
}

let mockTimer: ReturnType<typeof setInterval>

onMounted(() => {
  // 模拟学生提交打印任务 (每15秒可能来一个)
  mockTimer = setInterval(() => {
    if (Math.random() > 0.4) { 
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      const students = ['潘林昊', '杨宇晗', '陈逸凡', '李芊芊', '张子轩']
      const docs = ['七年级下册数学试卷.docx', '英语满分作文模板.pdf', '历史知识点背诵提纲.pdf']
      const randomStudent = students[Math.floor(Math.random() * students.length)]
      const doc = docs[Math.floor(Math.random() * docs.length)]
      
      printTasks.value.unshift({ time: timeStr, student: randomStudent, fileName: doc })
      
      ElNotification({
        title: '新打印任务！',
        message: `${randomStudent} 提交了文件: ${doc}`,
        type: 'info',
        duration: 4000
      })
    }
  }, 15000)
})

onUnmounted(() => {
  if (mockTimer) clearInterval(mockTimer)
})
</script>

<style scoped>
.service-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}
.queue-card {
  min-height: 600px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
}
.icon-print {
  color: #409EFF;
  font-size: 20px;
}
</style>