<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="员工姓名">
          <el-input v-model="queryParams.name" placeholder="员工姓名" clearable style="width: 200px;" />
        </el-form-item>
        <el-form-item label="员工账号">
          <el-input v-model="queryParams.account" placeholder="员工账号" clearable style="width: 200px;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 150px;">
            <el-option label="启用" value="enable" />
            <el-option label="停用" value="disable" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="content-wrapper">
      <div class="toolbar">
        <el-button type="primary" icon="Plus" @click="handleAdd">添加员工</el-button>
      </div>

      <el-table 
        v-loading="loading" 
        :data="staffList" 
        border 
        style="width: 100%"
        header-cell-class-name="table-header-gray"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column label="员工姓名" min-width="140">
          <template #default="{ row }">
            <span>{{ row.name }}</span>
            <span class="code-text"> ({{ row.code }})</span>
          </template>
        </el-table-column>

        <el-table-column label="组卷权限" min-width="160" align="center">
          <template #default="{ row }">
            <div v-if="row.paperPermission === 'active'" class="paper-perm-active">
              <div class="perm-label">到期日期</div>
              <div class="perm-date">{{ row.paperExpireDate }}</div>
            </div>
            <span v-else class="text-blue cursor-pointer">立即开通</span>
          </template>
        </el-table-column>

        <el-table-column prop="certification" label="认证" width="100" align="center">
          <template #default="{ row }">
             <span v-if="row.certification" class="text-blue">{{ row.certification }}</span>
             <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column prop="gender" label="性别" width="60" align="center" />
        <el-table-column prop="role" label="角色" width="120" align="center" />
        <el-table-column prop="totalUsers" label="全部用户数" width="100" align="center" />
        <el-table-column prop="activeMembers" label="在册会员量" width="100" align="center" />
        <el-table-column prop="attendanceId" label="考勤ID" width="100" align="center" />

        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.status === 'enable' ? 'text-green' : 'text-red'">
              {{ row.status === 'enable' ? '启用' : '停用' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="addTime" label="添加时间" width="160" align="center" />

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small">会员交接</el-button>
            <el-button link type="danger" size="small" @click="handleStatusChange(row)">
              {{ row.status === 'enable' ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="用于登录账号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="伴学师" value="伴学师" />
            <el-option label="执行店长" value="执行店长" />
            <el-option label="管理员" value="管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考勤ID">
          <el-input v-model="form.attendanceId" placeholder="绑定考勤机ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('添加员工')
const formRef = ref()

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  account: '',
  status: ''
})

const form = reactive({
  id: '',
  name: '',
  phone: '',
  role: '伴学师',
  gender: '女',
  attendanceId: ''
})

const rules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

interface Staff {
  id: number
  name: string
  code: string
  gender: string
  role: string
  paperPermission: 'active' | 'inactive' 
  paperExpireDate?: string
  certification: string
  totalUsers: number
  activeMembers: number
  attendanceId: string
  status: 'enable' | 'disable'
  addTime: string
}

const staffList = ref<Staff[]>([])

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    staffList.value = [
      { id: 1, name: '张振莹', code: '0672', gender: '女', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 1, activeMembers: 1, attendanceId: '116563', status: 'enable', addTime: '2025-12-06 09:35:46' },
      { id: 2, name: '朱厚恩', code: '0191', gender: '男', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 0, activeMembers: 0, attendanceId: '116481', status: 'enable', addTime: '2025-12-03 15:03:01' },
      { id: 3, name: '陈逸凡', code: '9176', gender: '女', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 8, activeMembers: 2, attendanceId: '116376', status: 'enable', addTime: '2025-11-28 23:07:02' },
      { id: 4, name: '杨宇晗', code: '3929', gender: '女', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 1, activeMembers: 1, attendanceId: '116231', status: 'enable', addTime: '2025-11-21 21:08:00' },
      { id: 5, name: '刘雨晴', code: '6287', gender: '女', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 0, activeMembers: 0, attendanceId: '116230', status: 'enable', addTime: '2025-11-21 21:07:35' },
      { id: 6, name: '徐轲昕', code: '8258', gender: '女', role: '伴学师', paperPermission: 'inactive', certification: '', totalUsers: 0, activeMembers: 0, attendanceId: '116229', status: 'enable', addTime: '2025-11-21 21:07:19' },
      { id: 7, name: '王冠杰', code: '8774', gender: '女', role: '执行店长', paperPermission: 'inactive', certification: '', totalUsers: 0, activeMembers: 0, attendanceId: '112592', status: 'enable', addTime: '2025-07-12 08:57:48' },
      { id: 8, name: '闫发展', code: '7800', gender: '男', role: '执行店长', paperPermission: 'inactive', certification: '伴学师', totalUsers: 1, activeMembers: 0, attendanceId: '100585', status: 'enable', addTime: '2024-08-06 10:44:31' },
      { id: 9, name: '马方旭', code: '8875', gender: '男', role: '执行店长', paperPermission: 'active', paperExpireDate: '2026-09-25 15:56:20', certification: '伴学师', totalUsers: 5, activeMembers: 3, attendanceId: '91582', status: 'enable', addTime: '2023-05-28 10:29:12' },
      { id: 10, name: '刘冲亚', code: '7508', gender: '男', role: '总店长,商城权限', paperPermission: 'inactive', certification: '伴学师', totalUsers: 0, activeMembers: 0, attendanceId: '91407', status: 'enable', addTime: '2023-04-28 10:10:38' },
    ]
    total.value = 10
    loading.value = false
  }, 300)
}

onMounted(() => {
  loadData()
})

const handleQuery = () => {
  loadData()
}

const resetQuery = () => {
  queryParams.name = ''
  queryParams.account = ''
  queryParams.status = ''
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '添加员工'
  form.id = ''
  form.name = ''
  form.phone = ''
  form.attendanceId = ''
  dialogVisible.value = true
}

const handleEdit = (row: Staff) => {
  dialogTitle.value = '编辑员工'
  form.name = row.name
  form.gender = row.gender
  // 修复：增加 || '' 避免 split undefined
  form.role = row.role.split(',')[0] || ''
  form.attendanceId = row.attendanceId
  dialogVisible.value = true
}

const submitForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

const handleStatusChange = (row: Staff) => {
  const actionText = row.status === 'enable' ? '停用' : '启用'
  ElMessageBox.confirm(
    `确认要${actionText}员工 "${row.name}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success(`${actionText}成功`)
    row.status = row.status === 'enable' ? 'disable' : 'enable'
  })
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}
.search-wrapper { margin-bottom: 15px; }
.content-wrapper { background: #fff; padding: 20px; border-radius: 4px; border: 1px solid #e4e7ed; }
.toolbar { margin-bottom: 15px; }
.code-text { color: #909399; font-size: 13px; }
.text-blue { color: #409EFF; }
.text-green { color: #67C23A; }
.text-red { color: #F56C6C; }
.cursor-pointer { cursor: pointer; }
.paper-perm-active { font-size: 12px; line-height: 1.4; text-align: center; }
.perm-label { color: #409EFF; }
.perm-date { color: #606266; }
:deep(.table-header-gray th) { background-color: #f5f7fa !important; color: #606266; font-weight: 600; }
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>