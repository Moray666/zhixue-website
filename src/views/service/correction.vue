<template>
  <div class="service-container">
    <el-card shadow="hover" class="queue-card">
      <template #header>
        <div class="card-header">
           <div class="header-title">
            <el-icon class="icon-edit"><EditPen /></el-icon>
            <span style="margin-left: 8px; font-weight: bold;">自主批改申请队列</span>
          </div>
          <el-badge :value="correctionTasks.length" :hidden="correctionTasks.length === 0" type="danger" />
        </div>
      </template>
      
      <el-table :data="correctionTasks" style="width: 100%" stripe empty-text="当前暂无批改申请">
        <el-table-column prop="time" label="申请时间" width="150" align="center" />
        <el-table-column prop="student" label="申请人" width="150" align="center">
           <template #default="{ row }">
            <el-tag size="small" type="warning">{{ row.student }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="科目/进度" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row, $index }">
            <el-button type="success" size="small" @click="handleTakeOrder($index, row)">接单批改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="`正在批改：${currentTask?.student} 的作业`"
      width="800px"
      top="5vh"
      destroy-on-close
    >
      <div class="correction-workbench">
        <div class="homework-image-box">
          <div class="image-title">学生上传的原卷</div>
          <el-image 
            style="width: 100%; height: 400px; border-radius: 4px; border: 1px solid #ebeef5;"
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            fit="cover"
            :preview-src-list="['https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png']"
          />
          <div class="image-tip">点击图片可放大查看细节</div>
        </div>

        <div class="correction-form-box">
          <el-form :model="correctionForm" label-position="top">
            <el-form-item label="本次作业得分 (百分制)">
              <el-input-number v-model="correctionForm.score" :min="0" :max="100" />
            </el-form-item>
            <el-form-item label="错题分析 & 伴学师评语">
              <el-input 
                v-model="correctionForm.comments" 
                type="textarea" 
                :rows="8" 
                placeholder="请输入详细的错题解析、鼓励的话语或下一步学习建议..." 
              />
            </el-form-item>
            <el-form-item label="奖励积分 (激励学生)">
              <el-radio-group v-model="correctionForm.points">
                <el-radio :label="0">不奖励</el-radio>
                <el-radio :label="5">+5 积分</el-radio>
                <el-radio :label="10">+10 积分</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">暂存进度</el-button>
          <el-button type="primary" @click="submitCorrection">提交批改结果</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'

interface CorrectionTask {
  time: string
  student: string
  subject: string
}

const correctionTasks = ref<CorrectionTask[]>([
  { time: '10:25', student: '耿田清', subject: '高中英语必修一Unit3阅读理解' },
  { time: '09:33', student: '陈逸凡', subject: '七年级英语听力训练' }
])

// --- 批改工作台逻辑 ---
const dialogVisible = ref(false)
const currentTaskIndex = ref(-1)
const currentTask = ref<CorrectionTask | null>(null)

const correctionForm = reactive({
  score: 0,
  comments: '',
  points: 0
})

// 接单按钮触发
const handleTakeOrder = (index: number, row: CorrectionTask) => {
  currentTaskIndex.value = index
  currentTask.value = row
  
  // 重置表单
  correctionForm.score = 85 // 给个默认及格分
  correctionForm.comments = ''
  correctionForm.points = 5
  
  // 打开工作台
  dialogVisible.value = true
}

// 提交批改结果
const submitCorrection = () => {
  if (currentTaskIndex.value > -1) {
    // 1. 从队列中移除该任务
    correctionTasks.value.splice(currentTaskIndex.value, 1)
    
    // 2. 模拟发送通知给学生端
    ElMessage.success(`批改完成！得分：${correctionForm.score}，结果已推送给 ${currentTask.value?.student}。`)
    
    // 3. 关闭工作台
    dialogVisible.value = false
  }
}

// --- 模拟实时请求逻辑 ---
let mockTimer: ReturnType<typeof setInterval>

onMounted(() => {
  mockTimer = setInterval(() => {
    if (Math.random() > 0.4) {
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      const students = ['潘林昊', '杨宇晗', '陈逸凡', '李芊芊', '张子轩']
      const subjects = ['七年级英语听力训练', '八年级数学几何证明', '高一物理牛顿定律练习', '九年级化学方程式配平']
      const randomStudent = students[Math.floor(Math.random() * students.length)]
      const sub = subjects[Math.floor(Math.random() * subjects.length)]
      
      correctionTasks.value.unshift({ time: timeStr, student: randomStudent, subject: sub })
      
      ElNotification({
        title: '新批改申请！',
        message: `${randomStudent} 申请批改: ${sub}`,
        type: 'warning',
        duration: 4000
      })
    }
  }, 18000) 
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
.icon-edit {
  color: #E6A23C;
  font-size: 20px;
}

/* 批改工作台布局 */
.correction-workbench {
  display: flex;
  gap: 20px;
}
.homework-image-box {
  flex: 1; /* 左侧占 1 份 */
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}
.image-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #303133;
}
.image-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 10px;
}
.correction-form-box {
  width: 350px; /* 右侧固定宽度 */
}
</style>