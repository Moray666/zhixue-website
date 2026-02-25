<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form" label-width="70px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="会员姓名">
              <el-input v-model="queryParams.name" placeholder="请输入姓名/手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员状态">
              <el-select v-model="queryParams.status" placeholder="全部状态" clearable>
                <el-option label="正式会员" value="official" />
                <el-option label="体验会员" value="trial" />
                <el-option label="未购买" value="none" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年级">
              <el-select v-model="queryParams.grade" placeholder="请选择" clearable>
                <el-option label="七年级" value="7" />
                <el-option label="八年级" value="8" />
                <el-option label="高一" value="10" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="伴学师">
              <el-input v-model="queryParams.teacher" placeholder="跟进老师" />
            </el-form-item>
          </el-col>
          
          <el-col :span="6">
             <el-form-item label="账号状态">
              <el-select v-model="queryParams.accountStatus" placeholder="全部" clearable>
                <el-option label="启用" value="enable" />
                <el-option label="禁用" value="disable" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <el-button icon="Download">导出表</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="table-actions">
      <el-button type="primary" icon="Plus">添加会员</el-button>
    </div>

    <el-table :data="userList" border style="width: 100%" v-loading="loading">
      
      <el-table-column label="会员姓名" min-width="140" fixed>
        <template #default="{ row }">
          <div class="user-name-cell" @click="goDetail(row)">
            <span class="link-type">{{ row.name }}</span>
            <span class="code-text">({{ row.code }})</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="gender" label="性别" width="60" align="center" />
      <el-table-column prop="grade" label="年级" width="80" align="center" />
      <el-table-column prop="school" label="公立校" min-width="120" show-overflow-tooltip />
      <el-table-column prop="teacher" label="伴学师" width="90" />

      <el-table-column label="家长绑定" width="90" align="center">
        <template #default="{ row }">
          <span v-if="row.isBind" class="text-success">已绑定</span>
          <span v-else class="text-danger">未绑定</span>
        </template>
      </el-table-column>

      <el-table-column prop="addTime" label="录入时间" width="160" sortable align="center" />

      <el-table-column label="会员状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.memberType === 'official'" type="success" effect="plain">正式会员</el-tag>
          <el-tag v-else-if="row.memberType === 'trial'" type="warning" effect="plain">体验会员</el-tag>
          <el-tag v-else type="info" effect="plain">未购买</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="startTime" label="开通时间" width="110" align="center">
        <template #default="{ row }">
          {{ row.startTime || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="endTime" label="截止时间" width="110" align="center">
        <template #default="{ row }">
          <span :class="{'text-danger': row.days <= 7 && row.days > 0}">{{ row.endTime || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="剩余天数" width="90" align="center">
        <template #default="{ row }">
          <span v-if="row.days > 7" class="text-success">{{ row.days }} 天</span>
          <span v-else-if="row.days > 0 && row.days <= 7" class="text-warning" style="font-weight: bold;">{{ row.days }} 天</span>
          <span v-else class="text-gray">--</span>
        </template>
      </el-table-column>

      <el-table-column label="账号状态" width="90" align="center">
        <template #default="{ row }">
          <span class="status-dot" :class="row.status === 'enable' ? 'bg-success' : 'bg-danger'"></span>
          {{ row.status === 'enable' ? '启用' : '禁用' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="goDetail(row)">操作</el-button>
          <el-button link type="primary" size="small">购买</el-button>
          <el-button link type="danger" size="small">停用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const total = ref(12)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  status: '',
  grade: '',
  teacher: '',
  accountStatus: ''
})

// ★ 模拟数据：加入了 startTime 和 endTime 字段
const userList = ref([
  { 
    id: 1, name: '潘林昊', code: '4631', gender: '男', grade: '七年级', school: '聊城文轩中学', teacher: '王冠杰', 
    isBind: false, addTime: '2026-02-12 15:51', memberType: 'none', 
    startTime: '', endTime: '', days: 0, status: 'enable' 
  },
  { 
    id: 2, name: '耿田清', code: '6388', gender: '女', grade: '高一', school: '聊城一中', teacher: '李政', 
    isBind: false, addTime: '2026-02-11 09:34', memberType: 'official', 
    startTime: '2026-02-11', endTime: '2026-06-11', days: 120, status: 'enable' 
  },
  { 
    id: 3, name: '刘墨涵', code: '8687', gender: '男', grade: '高二', school: '山东省聊城第一...', teacher: '张代鑫', 
    isBind: false, addTime: '2026-01-26 08:40', memberType: 'official', 
    startTime: '2026-01-26', endTime: '2026-03-12', days: 45, status: 'enable' 
  },
  { 
    id: 4, name: '李芊芊', code: '0607', gender: '女', grade: '高二', school: '北京市东城区卫...', teacher: '张代鑫', 
    isBind: false, addTime: '2026-01-04 21:27', memberType: 'trial', 
    startTime: '2026-01-04', endTime: '2026-01-09', days: 5, status: 'enable' // 模拟即将到期的会员
  },
])

const handleQuery = () => {
  loading.value = true
  setTimeout(() => loading.value = false, 500)
}

const resetQuery = () => {
  queryParams.name = ''
  queryParams.status = ''
}

// 跳转详情页
const goDetail = (row: any) => {
  router.push(`/student/detail/${row.id}`)
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}
.search-wrapper {
  margin-bottom: 15px;
}
.table-actions {
  margin-bottom: 15px;
}
.user-name-cell {
  cursor: pointer;
}
.link-type {
  color: #409EFF;
  font-weight: 500;
}
.link-type:hover {
  text-decoration: underline;
}
.code-text {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

/* 颜色状态类 */
.text-danger { color: #F56C6C; }
.text-success { color: #67C23A; }
.text-warning { color: #E6A23C; }
.text-gray { color: #909399; }

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.bg-success { background-color: #67C23A; }
.bg-danger { background-color: #F56C6C; }

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>