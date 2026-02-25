<template>
  <div class="service-workbench">
    <el-alert
      title="实时服务大厅已开启，正在监听学生端请求..."
      type="success"
      :closable="false"
      show-icon
      class="status-alert"
    />

    <el-row :gutter="20">
      
      <el-col :span="12">
        <el-card shadow="hover" class="queue-card">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon class="icon-print"><Printer /></el-icon>
                <span style="margin-left: 8px; font-weight: bold;">打印任务队列</span>
              </div>
              <el-badge :value="printTasks.length" :hidden="printTasks.length === 0" class="item" type="danger" />
            </div>
          </template>
          
          <el-table :data="printTasks" style="width: 100%" stripe empty-text="当前暂无打印任务">
            <el-table-column prop="time" label="申请时间" width="90" align="center" />
            <el-table-column prop="student" label="申请人" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small">{{ row.student }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip />
            <el-table-column label="操作" width="100" fixed="right" align="center">
              <template #default="{ row, $index }">
                <el-button type="primary" size="small" @click="finishPrint($index, row)">去打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" class="queue-card">
          <template #header>
            <div class="card-header">
               <div class="header-title">
                <el-icon class="icon-edit"><EditPen /></el-icon>
                <span style="margin-left: 8px; font-weight: bold;">自主批改申请</span>
              </div>
              <el-badge :value="correctionTasks.length" :hidden="correctionTasks.length === 0" class="item" type="danger" />
            </div>
          </template>
          
          <el-table :data="correctionTasks" style="width: 100%" stripe empty-text="当前暂无批改申请">
            <el-table-column prop="time" label="申请时间" width="90" align="center" />
            <el-table-column prop="student" label="申请人" width="100" align="center">
               <template #default="{ row }">
                <el-tag size="small" type="warning">{{ row.student }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="subject" label="科目/进度" show-overflow-tooltip />
            <el-table-column label="操作" width="100" fixed="right" align="center">
              <template #default="{ row, $index }">
                <el-button type="success" size="small" @click="finishCorrection($index, row)">接单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Printer, EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'

// --- 数据模型 ---
interface PrintTask {
  time: string
  student: string
  fileName: string
}

interface CorrectionTask {
  time: string
  student: string
  subject: string
}

// 初始任务队列
const printTasks = ref<PrintTask[]>([
  { time: '10:28', student: '刘墨涵', fileName: '八年级上册物理错题集.pdf' }
])

const correctionTasks = ref<CorrectionTask[]>([
  { time: '10:25', student: '耿田清', fileName: '高中英语必修一Unit3阅读理解' }
])

// --- 动作处理 ---
const finishPrint = (index: number, row: PrintTask) => {
  printTasks.value.splice(index, 1)
  ElMessage.success(`已发送 "${row.student}" 的文件至打印机！`)
}

const finishCorrection = (index: number, row: CorrectionTask) => {
  correctionTasks.value.splice(index, 1)
  ElMessage.success(`已接单！开始批改 "${row.student}" 的作业。`)
}

// --- ★ 核心：模拟真实环境下的 WebSocket 实时推送机制 ---
let mockTimer: ReturnType<typeof setInterval>

onMounted(() => {
  // 模拟每隔 15 秒，可能有学生发起一个新请求
  mockTimer = setInterval(() => {
    const isPrintTask = Math.random() > 0.5 // 50%概率是打印，50%是批改
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    // 模拟学生名单
    const students = ['潘林昊', '杨宇晗', '陈逸凡', '李芊芊', '张子轩']
    const randomStudent = students[Math.floor(Math.random() * students.length)]

    if (isPrintTask) {
      const docs = ['七年级下册数学试卷.docx', '英语满分作文模板.pdf', '历史知识点背诵提纲.pdf']
      const doc = docs[Math.floor(Math.random() * docs.length)]
      
      printTasks.value.unshift({ time: timeStr, student: randomStudent, fileName: doc })
      
      ElNotification({
        title: '新打印任务！',
        message: `${randomStudent} 提交了文件: ${doc}`,
        type: 'info',
        duration: 4000
      })
    } else {
      const subjects = ['七年级英语听力训练', '八年级数学几何证明', '高一物理牛顿定律练习']
      const sub = subjects[Math.floor(Math.random() * subjects.length)]
      
      correctionTasks.value.unshift({ time: timeStr, student: randomStudent, subject: sub })
      
      ElNotification({
        title: '新批改申请！',
        message: `${randomStudent} 申请批改: ${sub}`,
        type: 'warning',
        duration: 4000
      })
    }
  }, 15000) // 15秒触发一次
})

onUnmounted(() => {
  // 离开页面时清除定时器，防止内存泄漏
  if (mockTimer) clearInterval(mockTimer)
})
</script>

<style scoped>
.service-workbench {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.status-alert {
  margin-bottom: 20px;
}

.queue-card {
  height: 600px;
  overflow-y: auto;
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

.icon-edit {
  color: #E6A23C;
  font-size: 20px;
}
</style>