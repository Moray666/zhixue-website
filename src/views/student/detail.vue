<template>
  <div class="detail-container">
    
    <el-card shadow="never" class="header-card">
      <div class="user-profile-header">
        <el-avatar :size="80" class="user-avatar" :src="userInfo.avatar" />
        <div class="user-info-block">
          <div class="name-row">
            <h2 class="user-name">{{ userInfo.name }}</h2>
            <el-tag size="small" effect="plain" class="code-tag">会员码 {{ userInfo.code }}</el-tag>
          </div>
          <div class="sub-info">
            <span>{{ userInfo.phone }}</span>
            <el-divider direction="vertical" />
            <span>{{ userInfo.grade }}</span>
          </div>
          <div class="detail-row">
            <span class="label">伴学师：</span>
            <span class="value">{{ userInfo.teacher }}</span>
            <el-icon class="icon-chat"><ChatDotRound /></el-icon>
          </div>
          <div class="detail-row warning">
            <span class="label">家长电话：</span>
            <span class="value">{{ userInfo.parentPhone }}</span>
            <span class="label" style="margin-left: 15px;">绑定状态：</span>
            <span :class="userInfo.isBind ? 'text-success' : 'text-red'">{{ userInfo.isBind ? '已绑定' : '未绑定' }}</span>
          </div>
        </div>
        
        <div class="header-actions">
           <div class="card-status-box">
             <div v-if="!userInfo.isMember" class="empty-card-state">
               <el-icon size="24" color="#e0e0e0"><Wallet /></el-icon>
               <p>尚未购买会员</p>
             </div>
             <div v-else class="member-card-state">
                <p class="card-name">正式会员</p>
                <p class="card-date">有效期至: 2026-12-31</p>
             </div>
          </div>
          <div class="action-btns">
            <el-button type="primary">开通会员</el-button>
            <el-button>更多操作</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <div class="tabs-container">
      <el-tabs v-model="activeTab" class="profile-tabs">
        <el-tab-pane label="会员档案" name="profile" />
        <el-tab-pane label="学习记录" name="study" />
        <el-tab-pane label="错题本" name="mistake" />
      </el-tabs>
    </div>

    <div class="content-area">
      <div v-if="activeTab === 'profile'">
        
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-title">
              <span>基本信息</span>
              <el-button link type="primary" size="small" @click="handleEditInfo">
                <el-icon><Edit /></el-icon> 编辑信息
              </el-button>
            </div>
          </template>
          
          <el-descriptions :column="3" border>
            <el-descriptions-item label="会员账号">{{ userInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="伴学师">{{ userInfo.teacher }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ userInfo.remark || '暂无备注' }}</el-descriptions-item>
            
            <el-descriptions-item label="考勤ID">1561219</el-descriptions-item>
            <el-descriptions-item label="家长电话">{{ userInfo.parentPhone }}</el-descriptions-item>
            <el-descriptions-item label="在读年级">{{ userInfo.grade }}</el-descriptions-item>
            
            <el-descriptions-item label="公立校">{{ userInfo.school || '暂无' }}</el-descriptions-item>
            <el-descriptions-item label="住校情况">
              <el-tag size="small" :type="userInfo.residence === '住校' ? 'warning' : 'info'">{{ userInfo.residence }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">2026-02-12 15:51</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card shadow="never" class="section-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-title">
              <span>学习情况</span>
            </div>
          </template>
          
          <div class="sub-section">
            <div class="sub-header">
              <span class="title">提分目标</span>
              <el-button link type="primary" @click="handleEditTarget">
                 <el-icon><Edit /></el-icon> 编辑目标
              </el-button>
            </div>
            <el-table :data="[targetScore]" border size="small">
              <el-table-column prop="chinese" label="语文" />
              <el-table-column prop="math" label="数学" />
              <el-table-column prop="english" label="英语" />
              <el-table-column prop="physics" label="物理" />
              <el-table-column prop="chemistry" label="化学" />
              <el-table-column prop="biology" label="生物" />
              <el-table-column prop="history" label="历史" />
              <el-table-column prop="total" label="目标总分" width="100" fixed="right" />
            </el-table>
          </div>

          <div class="sub-section" style="margin-top: 25px;">
             <div class="sub-header">
              <span class="title">近期考试成绩</span>
              <div>
                 <el-button type="primary" link @click="handleAddExam">
                   <el-icon><Plus /></el-icon> 添加成绩
                 </el-button>
              </div>
            </div>
            
            <el-table :data="examList" border stripe size="small" style="margin-top: 10px;">
              <el-table-column prop="examName" label="考试名称" min-width="120" />
              <el-table-column prop="date" label="考试日期" width="100" />
              <el-table-column prop="chinese" label="语文" width="60" />
              <el-table-column prop="math" label="数学" width="60" />
              <el-table-column prop="english" label="英语" width="60" />
              <el-table-column prop="physics" label="物理" width="60" />
              <el-table-column prop="total" label="总分" width="70" fixed="right">
                <template #default="{ row }">
                  <span style="font-weight: bold; color: #409EFF">{{ row.total }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row, $index }">
                  <el-button link type="primary" size="small" @click="handleEditExam(row, $index)">修改</el-button>
                  <el-button link type="danger" size="small" @click="handleDeleteExam($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="infoDialogVisible" title="编辑基本信息" width="550px">
      <el-form :model="infoForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="infoForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="家长电话">
              <el-input v-model="infoForm.parentPhone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
           <el-col :span="12">
            <el-form-item label="年级">
               <el-select v-model="infoForm.grade" style="width: 100%">
                 <el-option label="七年级" value="七年级" />
                 <el-option label="八年级" value="八年级" />
                 <el-option label="九年级" value="九年级" />
                 <el-option label="高一" value="高一" />
                 <el-option label="高二" value="高二" />
                 <el-option label="高三" value="高三" />
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="伴学师">
               <el-input v-model="infoForm.teacher" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="公立校">
          <el-select 
            v-model="infoForm.school" 
            filterable 
            allow-create 
            default-first-option
            placeholder="请搜索或输入公立校名称" 
            style="width: 100%"
          >
            <el-option
              v-for="item in schoolOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="住校情况">
          <el-radio-group v-model="infoForm.residence">
            <el-radio label="走读">走读</el-radio>
            <el-radio label="住校">住校</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="infoForm.remark" type="textarea" placeholder="填写学员特征等备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="infoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInfo">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="examDialogVisible" :title="examDialogTitle" width="600px">
      <el-form :model="examForm" label-width="80px" class="exam-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试名称">
              <el-input v-model="examForm.examName" placeholder="如: 月考/期中" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试日期">
              <el-date-picker v-model="examForm.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">各科成绩</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8">
             <el-form-item label="语文"><el-input-number v-model="examForm.chinese" :min="0" :max="150" controls-position="right" /></el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="数学"><el-input-number v-model="examForm.math" :min="0" :max="150" controls-position="right" /></el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="英语"><el-input-number v-model="examForm.english" :min="0" :max="150" controls-position="right" /></el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="物理"><el-input-number v-model="examForm.physics" :min="0" :max="100" controls-position="right" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="examDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExam">保存成绩</el-button>
      </template>
    </el-dialog>
    
    <el-dialog v-model="targetDialogVisible" title="设置提分目标" width="600px">
        <el-form :model="targetForm" label-width="60px">
           <el-row :gutter="10">
             <el-col :span="6"><el-form-item label="语文"><el-input v-model="targetForm.chinese"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="数学"><el-input v-model="targetForm.math"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="英语"><el-input v-model="targetForm.english"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="物理"><el-input v-model="targetForm.physics"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="化学"><el-input v-model="targetForm.chemistry"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="生物"><el-input v-model="targetForm.biology"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="历史"><el-input v-model="targetForm.history"/></el-form-item></el-col>
             <el-col :span="6"><el-form-item label="总分"><el-input v-model="targetForm.total" placeholder="自动计算" disabled/></el-form-item></el-col>
           </el-row>
        </el-form>
        <template #footer>
          <el-button @click="targetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTarget">更新目标</el-button>
        </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ChatDotRound, Wallet, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('profile')

// --- 学校数据库 (提取自需求) ---
const schoolOptions = [
  '山东省聊城第四中学', '山东聊城第六中学', '山东聊城第七中学', '聊城市实验中学', '向阳中学', '东昌府区堂邑中学', '文轩总校', '东昌中学兴华路校区', '文轩西校', '聊城少年军校', '少林武术学校', '聊城颐中外国语学校', '颐中外国语开发区校区', '聊城市东昌府区博雅学校', '东昌府区滨河实验学校', '聊城市水城慧德学校', '聊城东方实验学校', '聊城第五中学', '孟达外国语学校', '文苑初级中学', '东方中学', '东苑中学', '聊城第十一中学', '聊城市第一实验学校', '水城双语学校', '东昌中学南校', '东昌中学范恭屯校区', '聊城第九中学', '聊城闫寺实验学校', '梁水镇中心中学', '东昌府区八甲刘中学', '东昌府区斗虎屯镇中学', '东昌府区道口铺街道办事处中学', '东昌府区张炉集中学', '东昌府区郑家镇中学', '东昌府区沙镇中学', '东昌府区大张中学', '东昌府区侯营镇第一中学', '文轩昌润路校区', '开发区实验学校', '开发区东昌中学东校区', '开发区运河实验学校', '开发区蒋官屯街道办事处中学', '开发区北城办事处中学', '开发区物流园学校', '广平镇中学', '东昌中学新校区', '高新区区实验中学', '高新区行知学校', '高新区文轩中学', '高新区许营镇中学', '东昌府区韩集镇中学', '高新区顾官屯镇中学', '颐中外国语学校度假区分校', '度假区朱老庄镇中学', '度假区李海务街道办事处中学', '度假区于集镇中学', '度假区北大培文学校', '莘县明天中学', '莘县实验初级中学', '莘县棉纺织厂学校', '莘县莘州初级中学', '莘县翰林学校', '莘县甘泉学校', '莘县东鲁中学', '莘县油田学校', '莘县新城实验学校', '莘县新华路学校', '莘县莘亭初级中学', '莘县河店镇中心初级中学', '莘县翔宇学校', '莘县燕店镇中心初级中学', '莘县魏庄镇中心初级中学', '莘县大王寨镇中心初级中学', '莘县三立学校', '莘县王奉镇中心初级中学', '莘县张鲁回族镇中心初级中学', '莘县张鲁镇慧园初级中学', '莘县俎店镇中心初级中学', '莘县董杜庄镇中心初级中学', '莘县妹冢镇中心初级中学', '莘县张寨镇中心初级中学', '莘县朝城镇中心初级中学', '莘县武阳学校', '莘县徐庄镇中心初级中学', '莘县十八里铺镇中心初级中学', '莘县王庄集镇向上中学', '莘县柿子园镇中心初级中学', '莘县观城镇育才中学', '莘县大张家镇中心初级中学', '莘县古云镇中心初级中学', '莘县樱桃园镇中心初级中学', '莘县樱桃园镇实验中学', '莘县古城镇中心初级中学', '莘县古城镇舍利寺初级中学', '莘县春笋学校', '茌平第三中学', '茌平实验中学', '茌平茌山学校', '茌平一中附中', '茌平振兴街道中学', '茌平振兴街道中学翰林校区', '茌平杜郎口镇中学', '茌平乐平铺镇中学', '茌平乐平铺镇郝集中学', '茌平博平镇中学', '茌平杨官屯乡中学', '茌平洪官屯镇中学', '茌平贾寨镇中学', '茌平菜屯镇中学', '茌平肖家庄镇中学', '茌平韩屯镇中学', '茌平胡屯镇中学', '茌平冯官屯镇中学', '阳谷实验中学', '阳谷第二实验中学', '阳谷世纪园学校', '阳谷谷山学校', '阳谷狮子楼学校', '阳谷伏城爱迪初级中学', '阳谷嘉和城中学', '阳谷铜谷中学', '阳谷第一初级中学', '阳谷第三实验中学', '阳谷李台中学', '阳谷金斗营中学', '阳谷高庙王中学', '阳谷寿张镇中学', '阳谷寿张镇四棚中学', '阳谷十五里园中学', '阳谷张秋中学', '阳谷阿城中学', '阳谷阿城镇范海中学', '阳谷闫楼镇中心中学', '阳谷七级中学', '阳谷安乐镇中学', '阳谷石佛中学', '阳谷郭屯中学', '阳谷定水镇中学', '阳谷大布中学', '阳谷西湖中学', '东阿南湖行知学校', '东阿实验中学', '东阿第五中学', '东阿姜楼中学', '东阿第三中学', '东阿第二中学', '东阿第四中学', '东阿高集中学', '冠县外国语学校', '冠县忠信学校', '冠县实验中学', '冠县金太阳中学', '冠县育才学校(初中部)', '冠县汇文学校', '冠县实高学校', '冠县清泉街道办事处中学', '冠县崇文街道办事处中学', '冠县东古城镇中学', '冠县斜店乡中学', '冠县梁堂中学', '冠县桑阿镇中学', '冠县定远寨镇中学', '冠县辛集镇中学', '冠县范寨镇中学', '冠县柳林镇中学', '冠县甘官屯镇中学', '冠县兰沃乡中学', '冠县贾镇中学', '冠县烟庄街道办事处中学', '冠县店子镇中学', '冠县清水镇中学', '冠县北馆陶镇中学', '冠县万善乡中学', '冠县一中', '冠县武训中学', '高唐第一实验中学', '高唐第二实验中学', '高唐时风中学', '高唐北京新学道双海湖实验学校', '高唐鸣山学校', '高唐江山实验学校', '高唐崇文实验学校', '高唐姜店中学', '高唐赵寨子中学', '高唐清平中学', '高唐三十里铺中学', '高唐梁村中学', '高唐尹集中学', '高唐固河中学', '高唐杨屯中学', '高唐琉寺中学', '临清京华中学', '临清民族实验中学', '临清民族实验中学北校区', '临清实验中学', '临清明德中学', '临清清华园学校', '临清一中初级中学', '临清康庄镇第一中学', '临清康庄镇第二中学', '临清宏立中学', '临清金郝庄镇第一中学', '临清金郝庄镇第二中学', '临清烟店镇中学', '临清烟店镇文训学校', '临清魏湾镇中学', '临清新华路街道办事处中学', '临清青年办事处中学', '临清自忠中学', '临清老赵庄镇中学', '临清潘庄镇中学', '临清潘庄镇文启中学', '临清尚店镇中学', '临清丕介中学', '临清大辛庄办事处中学', '临清刘垓子镇中学', '临清松林镇中学', '临清戴湾中学', '向阳实验中学'
]

// --- 1. 用户基本信息数据 ---
const userInfo = reactive({
  name: '潘林昊',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  code: '4631',
  phone: '13561214631',
  grade: '七年级',
  teacher: '王冠杰',
  parentPhone: '13561214631',
  isBind: false,
  isMember: false,
  school: '文轩总校',
  residence: '走读',
  remark: ''
})

// 编辑基本信息逻辑
const infoDialogVisible = ref(false)
const infoForm = reactive({
  name: '',
  grade: '',
  parentPhone: '',
  school: '',
  residence: '走读',
  teacher: '',
  remark: ''
})

const handleEditInfo = () => {
  // 赋值时增加 || '' 保底，解决 TS 报错
  Object.assign(infoForm, {
    name: userInfo.name || '',
    grade: userInfo.grade || '',
    parentPhone: userInfo.parentPhone || '',
    school: userInfo.school || '',
    residence: userInfo.residence || '走读',
    teacher: userInfo.teacher || '',
    remark: userInfo.remark || ''
  })
  infoDialogVisible.value = true
}

const saveInfo = () => {
  Object.assign(userInfo, infoForm)
  infoDialogVisible.value = false
  ElMessage.success('基本信息已更新')
}

// --- 2. 目标成绩数据 ---
const targetScore = reactive({
  chinese: '110', math: '120', english: '115', physics: '90', 
  chemistry: '-', biology: '-', history: '-', total: '435'
})

const targetDialogVisible = ref(false)
const targetForm = reactive({ ...targetScore })

const handleEditTarget = () => {
  Object.assign(targetForm, targetScore)
  targetDialogVisible.value = true
}

const saveTarget = () => {
  Object.assign(targetScore, targetForm)
  targetDialogVisible.value = false
  ElMessage.success('目标成绩已更新')
}


// --- 3. 考试成绩列表逻辑 ---
const examList = ref([
  { id: 1, examName: '七年级上期末', date: '2026-01-15', chinese: 105, math: 112, english: 108, physics: 85, total: 410 },
  { id: 2, examName: '七年级上月考', date: '2025-12-10', chinese: 98, math: 105, english: 95, physics: 80, total: 378 }
])

const examDialogVisible = ref(false)
const examDialogTitle = ref('添加成绩')
const isEditExam = ref(false)
const currentEditIndex = ref(-1)

// 初始空表单
const defaultExamForm = {
  examName: '', date: '', chinese: 0, math: 0, english: 0, physics: 0, total: 0
}
const examForm = reactive({ ...defaultExamForm })

const handleAddExam = () => {
  examDialogTitle.value = '添加新考试'
  isEditExam.value = false
  Object.assign(examForm, defaultExamForm) 
  examForm.date = new Date().toISOString().split('T')[0]
  examDialogVisible.value = true
}

const handleEditExam = (row: any, index: number) => {
  examDialogTitle.value = '修改成绩'
  isEditExam.value = true
  currentEditIndex.value = index
  Object.assign(examForm, row) 
  examDialogVisible.value = true
}

const saveExam = () => {
  const total = Number(examForm.chinese) + Number(examForm.math) + Number(examForm.english) + Number(examForm.physics)
  
  const newRecord = {
    ...examForm,
    total: total,
    id: isEditExam.value ? examList.value[currentEditIndex.value].id : Date.now()
  }

  if (isEditExam.value) {
    examList.value[currentEditIndex.value] = newRecord
    ElMessage.success('成绩修改成功')
  } else {
    examList.value.unshift(newRecord) 
    ElMessage.success('成绩添加成功')
  }
  examDialogVisible.value = false
}

const handleDeleteExam = (index: number) => {
  examList.value.splice(index, 1)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.detail-container { background-color: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 0; border: none; border-bottom: 1px solid #ebeef5; }
.user-profile-header { display: flex; align-items: flex-start; }
.user-avatar { margin-right: 20px; border: 4px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.user-info-block { flex: 1; }
.name-row { display: flex; align-items: center; margin-bottom: 8px; }
.user-name { margin: 0 10px 0 0; font-size: 20px; font-weight: bold; }
.sub-info { color: #606266; font-size: 14px; margin-bottom: 10px; }
.detail-row { font-size: 13px; color: #606266; margin-bottom: 6px; display: flex; align-items: center; }
.text-red { color: #F56C6C; }
.text-success { color: #67C23A; }

.card-status-box { background: #fdfdfd; border: 1px dashed #dcdfe6; border-radius: 6px; width: 160px; height: 60px; display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }
.empty-card-state { font-size: 12px; color: #909399; text-align: center; }
.empty-card-state p { margin: 0; }
.header-actions { display: flex; flex-direction: column; align-items: flex-end; }
.tabs-container { background: #fff; padding: 0 20px; border-bottom: 1px solid #ebeef5; }
.content-area { padding: 20px; }
.section-card { margin-bottom: 20px; }
.card-title { font-weight: bold; font-size: 16px; border-left: 4px solid #409EFF; padding-left: 10px; display: flex; justify-content: space-between; align-items: center; }
.sub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.sub-header .title { font-weight: bold; font-size: 14px; color: #303133; }
</style>